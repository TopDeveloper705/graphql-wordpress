import { requireModules } from 'utils/fs';

const models = requireModules(__dirname);

export default function addModelsToContext(context) {
  const newContext = Object.assign({}, context);
  Object.keys(models).forEach(key => {
    newContext[key] = new models[key](newContext);
  });
  return newContext;
}
