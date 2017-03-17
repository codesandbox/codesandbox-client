export const modulesSelector = state => state.entities.modules;
export const isMainModule = module =>
  module.title === 'index.js' && module.directoryId == null;
