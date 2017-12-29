// @flow
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import crypto from 'crypto';
import sharp from 'sharp';
import mm from 'musicmetadata';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import Settings from 'server/graphql/models/Settings';

/* eslint-disable class-methods-use-this, consistent-return */

type Callback = (err: any, value?: any) => any;

type FileParts = {
  destination: string,
  ext: string,
  basename: string,
};

type FileUpload = {
  destination: string,
  path: string,
  originalname: string,
  mimetype: string,
  encoding: string,
  filename: string,
  stream: ReadableStream,
};

type CropInfo = {
  fileName: string,
  fileSize: number,
  width: number,
  height: number,
};

type StorageOpts = {
  db: any,
  uploadDir: string,
};

class MediaStorage {
  opts: StorageOpts;

  constructor(opts: StorageOpts) {
    this.opts = opts;
  }

  async getSettings() {
    const settings = new Settings({ db: this.opts.db });
    return settings.findOneById('media');
  }

  getDestination(): string {
    const d = new Date();
    const month = d.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const uploadsFolder = path.join(this.opts.uploadDir, `${d.getFullYear()}`, monthStr);
    mkdirp.sync(uploadsFolder);
    return uploadsFolder;
  }

  getFilename(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pseudoRandomBytes(8, (err, raw) => {
        if (err) {
          reject(err);
        } else {
          const filename = raw.toString('hex');
          resolve(filename);
        }
      });
    });
  }

  handleCrop(
    src: string,
    size: [number, number],
    { destination, ext, basename }: FileParts
  ): Promise<CropInfo> {
    return new Promise((resolve, reject) => {
      const [width = null, height = null] = size;
      const cropName = `${basename}-${width || 0}x${height || 0}${ext}`;
      const cropPath = path.join(destination, cropName);

      return sharp(src)
        .resize(size[0] || null, size[1] || null)
        .withoutEnlargement()
        .toFile(cropPath, (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              fileName: cropName,
              fileSize: info.size,
              width: info.width,
              height: info.height,
            });
          }
        });
    });
  }

  async handleImage(file: FileUpload, { destination, ext, basename }: FileParts, cb: Callback) {
    const fileName = `${basename}${ext}`;
    const finalPath = `${path.join(destination, fileName)}`;
    const original = { fileName, width: 0, height: 0, fileSize: 0 };
    const imageMeta = sharp().on('info', info => {
      original.width = info.width;
      original.height = info.height;
      original.fileSize = info.size;
    });

    const outStream = fs.createWriteStream(finalPath);
    outStream.on('error', cb);
    outStream.on('finish', async () => {
      const settings = await this.getSettings();
      const sizes = settings.crops.map(({ width, height }) => {
        if (width < original.width && height > original.height) {
          return [width];
        } else if (height < original.height && width > original.width) {
          return [null, height];
        }
        return [width, height];
      });
      const crops = await Promise.all(
        sizes.map(size => this.handleCrop(finalPath, size, { destination, ext, basename }))
      );

      cb(null, {
        ...original,
        mimeType: file.mimetype,
        originalName: file.originalname,
        destination: destination.replace(`${this.opts.uploadDir}/`, ''),
        crops,
      });
    });
    // $FlowFixMe
    file.stream.pipe(imageMeta).pipe(outStream);
  }

  async handleAudio(file: FileUpload, { destination, ext, basename }: FileParts, cb: Callback) {
    const fileName = `${basename}${ext}`;
    const finalPath = path.join(destination, fileName);

    const outStream = fs.createWriteStream(finalPath);
    outStream.on('error', cb);
    outStream.on('finish', async () => {
      const readMetadata = () =>
        new Promise((resolve, reject) => {
          const audioStream = fs.createReadStream(finalPath);
          mm(audioStream, { duration: true }, (err, metadata) => {
            if (err) {
              reject(err);
            } else {
              resolve(metadata);
            }
          });
        });
      const metadata = await readMetadata();
      let images = [];
      if (metadata.picture && metadata.picture.length > 0) {
        images = await Promise.all(
          metadata.picture.map(
            ({ data, format }, i) =>
              new Promise((resolve, reject) => {
                const coverName = `${basename}-cover-${i}.${format}`;
                const coverPath = path.join(destination, coverName);
                sharp(data).toFile(coverPath, (err, info) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({
                      fileName: coverName,
                      fileSize: info.size,
                      width: info.width,
                      height: info.height,
                    });
                  }
                });
              })
          )
        );
      }

      cb(null, {
        title: metadata.title,
        artist: metadata.artist || [],
        albumArtist: metadata.albumartist || [],
        genre: metadata.genre || [],
        year: metadata.year ? parseInt(metadata.year, 10) : null,
        album: metadata.album,
        duration: metadata.duration,
        images,
        mimeType: file.mimetype,
        originalName: file.originalname,
        destination: destination.replace(`${this.opts.uploadDir}/`, ''),
        fileName,
        // $FlowFixMe
        fileSize: outStream.bytesWritten,
      });
    });
    // $FlowFixMe
    file.stream.pipe(outStream);
  }

  async handleVideo(file: FileUpload, { destination, ext, basename }: FileParts, cb: Callback) {
    const fileName = `${basename}${ext}`;
    const finalPath = path.join(destination, fileName);

    const outStream = fs.createWriteStream(finalPath);
    outStream.on('error', cb);
    outStream.on('finish', async () => {
      const metadata = await ffprobe(finalPath, { path: ffprobeStatic.path });
      const [video] = metadata.streams;
      cb(null, {
        width: video.width,
        height: video.height,
        duration: parseFloat(video.duration),
        mimeType: file.mimetype,
        originalName: file.originalname,
        destination: destination.replace(`${this.opts.uploadDir}/`, ''),
        fileName,
        // $FlowFixMe
        fileSize: outStream.bytesWritten,
      });
    });
    // $FlowFixMe
    file.stream.pipe(outStream);
  }

  async _handleFile(req, file: FileUpload, cb: Callback) {
    const destination = this.getDestination();
    const name = file.originalname;
    const ext = name.substring(name.lastIndexOf('.'));
    const basename = await this.getFilename();

    if (file.mimetype.indexOf('image/') === 0) {
      this.handleImage(file, { destination, ext, basename }, cb);
    } else if (file.mimetype.indexOf('audio/') === 0) {
      this.handleAudio(file, { destination, ext, basename }, cb);
    } else if (file.mimetype.indexOf('video/') === 0) {
      this.handleVideo(file, { destination, ext, basename }, cb);
    } else {
      const fileName = `${basename}${ext}`;
      const finalPath = path.join(destination, fileName);
      const outStream = fs.createWriteStream(finalPath);
      outStream.on('error', cb);
      outStream.on('finish', () => {
        cb(null, {
          mimeType: file.mimetype,
          originalName: file.originalname,
          destination: destination.replace(`${this.opts.uploadDir}/`, ''),
          fileName,
          // $FlowFixMe
          fileSize: outStream.bytesWritten,
        });
      });
      // $FlowFixMe
      file.stream.pipe(outStream);
    }
  }

  _removeFile(req, file: FileUpload, cb: Callback) {
    const { path: filePath } = file;

    delete file.destination;
    delete file.filename;
    delete file.path;

    fs.unlink(filePath, cb);
  }
}

export default (opts: StorageOpts): MediaStorage => new MediaStorage(opts);
