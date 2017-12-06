import Tag from './Tag';
import Video from './Video';
import Settings from './Settings';

const models = {};

export default function addModelsToContext(context) {
  const newContext = Object.assign({}, context);
  Object.keys(models).forEach(key => {
    newContext[key] = new models[key](newContext);
  });
  return newContext;
}

models.Tag = Tag;
models.Video = Video;
models.Settings = Settings;
