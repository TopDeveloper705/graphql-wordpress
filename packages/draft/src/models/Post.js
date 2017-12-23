import { ObjectId } from 'mongodb';
import Model from './Model';
import { getUniqueSlug } from './utils';

function convertEntityData(entityMap) {
  return entityMap.map(entity => {
    const normalized = {};
    if (entity.data.type === 'EMBED') {
      const { type, url, html } = entity.data;
      normalized.data = { type, url, html };
    } else if (entity.data.type === 'LINK') {
      const { type, href, target } = entity.data;
      normalized.data = { type, href, target };
    } else if (entity.data.type === 'IMAGE') {
      const { type, imageId, size } = entity.data;
      normalized.data = { type, imageId, size };
      normalized.data.imageId = ObjectId(imageId);
    } else if (entity.data.type === 'VIDEO') {
      const { type, videoId } = entity.data;
      normalized.data = { type, videoId };
      normalized.data.videoId = ObjectId(videoId);
    } else {
      normalized.data = entity.data;
    }
    const { type, mutability } = entity;
    normalized.type = type;
    normalized.mutability = mutability;
    return normalized;
  });
}

export default class Post extends Model {
  constructor(context) {
    super(context);

    this.collection = context.db.collection('post');
  }

  all({ limit = 10, offset = 0, search = null }) {
    const criteria = {};
    if (search) {
      criteria.$text = { $search: search };
    }

    return this.collection
      .find(criteria)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  async insert(doc) {
    if (!doc.title) {
      throw new Error('Post requires a title.');
    }
    const slug = await getUniqueSlug(this.collection, doc.title);
    const docToInsert = Object.assign({}, doc, {
      slug,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    docToInsert.contentState.entityMap = convertEntityData(docToInsert.contentState.entityMap);
    const id = (await this.collection.insertOne(docToInsert)).insertedId;
    return id;
  }

  async updateById(id, doc) {
    const docToUpdate = Object.assign({}, doc);
    docToUpdate.contentState.entityMap = convertEntityData(docToUpdate.contentState.entityMap);
    const ret = await this.collection.update(
      { _id: id },
      {
        $set: Object.assign({}, docToUpdate, {
          updatedAt: Date.now(),
        }),
      }
    );
    this.loader.clear(id);
    return ret;
  }
}
