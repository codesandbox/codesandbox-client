// @flow
import evalModule from '../eval';

import type { Module } from '../../app/store/entities/sandboxes/modules/entity';
import type {
  Directory,
} from '../../app/store/entities/sandboxes/directories/entity';

let cachedBoilerplates = [];

export function evalBoilerplates(
  boilerplates: Array<any>,
  modules: Array<Module>,
  directories: Array<Directory>,
  manifest: Object,
) {
  cachedBoilerplates = boilerplates.map(boilerplate => {
    const fakeModule: Module = {
      id: boilerplate.id,
      title: `boilerplate-${boilerplate.condition}`,
      code: boilerplate.code,
      directoryShortid: null,
      sourceId: boilerplate.sourceId,
      isNotSynced: false,
      type: '',
    };

    const module = evalModule(fakeModule, '', modules, directories, manifest);
    return { ...boilerplate, module };
  });
}

export function getBoilerplates(): Array<any> {
  return cachedBoilerplates;
}

export function findBoilerplate(module: Module): any {
  const boilerplates = getBoilerplates();
  const boilerplate = boilerplates.find(b => {
    const regex = new RegExp(b.condition);
    return regex.test(module.title);
  });

  if (boilerplate == null) {
    throw new Error(
      `No boilerplate found for ${module.title}, you can create one in the future`,
    );
  }

  return boilerplate;
}
