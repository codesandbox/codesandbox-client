// @flow
import type { Module, Directory } from 'common/types';

function findById(entities: Array<Module | Directory>, id: string) {
  return entities.find(e => e.id === id);
}

function findByShortid(entities: Array<Module | Directory>, shortid: ?string) {
  return entities.find(e => e.shortid === shortid);
}

export default (
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string,
) => {
  const module = findById(modules, id);

  if (!module) return '';

  let directory = findByShortid(directories, module.directoryShortid);
  let path = '/';
  while (directory != null) {
    path = `/${directory.title}${path}`;
    directory = findByShortid(directories, directory.directoryShortid);
  }
  return `${path}${module.title}`;
};
