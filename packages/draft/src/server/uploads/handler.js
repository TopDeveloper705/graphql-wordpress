import Media from 'server/graphql/models/Media';

const mediaFields = ['originalName', 'destination', 'fileName', 'mimeType', 'fileSize'];

export default db => async (req, res) => {
  const filesToSave = [];
  const files = req.files.map(file => {
    const baseProps = {};
    mediaFields.forEach(field => {
      baseProps[field] = file[field];
    });

    const typeProps = {};
    if (file.mimetype.indexOf('image/') === 0) {
      typeProps.type = 'image';
      typeProps.title = '';
      typeProps.width = file.width;
      typeProps.height = file.height;
      typeProps.crops = file.crops;
      typeProps.caption = '';
      typeProps.altText = '';
      const fileProps = Object.assign({}, baseProps, typeProps);
      filesToSave.push(fileProps);
      return fileProps;
    } else if (file.mimetype.indexOf('audio/') === 0) {
      typeProps.type = 'audio';
      typeProps.description = '';
      typeProps.title = file.title;
      typeProps.artist = file.artist;
      typeProps.albumArtist = file.albumArtist;
      typeProps.genre = file.genre;
      typeProps.year = file.year;
      typeProps.album = file.album;
      typeProps.duration = file.duration;
      typeProps.images = file.images;
      const fileProps = Object.assign({}, baseProps, typeProps);
      filesToSave.push(fileProps);
      return fileProps;
    } else if (file.mimetype.indexOf('video/') === 0) {
      typeProps.type = 'video';
      typeProps.description = '';
      typeProps.width = file.width;
      typeProps.height = file.height;
      typeProps.duration = file.duration;
      const fileProps = Object.assign({}, baseProps, typeProps);
      filesToSave.push(fileProps);
      return fileProps;
    }
    return Object.assign({}, baseProps, typeProps);
  });

  if (filesToSave.length > 0) {
    const media = new Media({ db });
    const ids = await Promise.all(filesToSave.map(file => media.insert(file)));
    res.json(ids);
  } else {
    res.json(files);
  }
};
