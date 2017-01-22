// @flow
import evalModule from '../eval';

import type { Boilerplate } from '../../app/store/entities/boilerplates';
import type { Module } from '../../app/store/entities/modules';
import type { Directory } from '../../app/store/entities/directories';

type EvalBoilerplate = Boilerplate & {
  module: Object;
};

let cachedBoilerplates: Array<EvalBoilerplate> = [];

export function evalBoilerplates(
  boilerplates: Array<Boilerplate>,
  modules: Array<Module>,
  directories: Array<Directory>,
  manifest: Object,
) {
  cachedBoilerplates = boilerplates.map((boilerplate) => {
    const fakeModule: Module = {
      id: boilerplate.id,
      title: `boilerplate-${boilerplate.condition}`,
      code: boilerplate.code,
      directoryId: null,
      sourceId: boilerplate.sourceId,
      type: '',
    };

    const module = evalModule(fakeModule, modules, directories, manifest);
    return { ...boilerplate, module };
  });
}

export function getBoilerplates(): Array<EvalBoilerplate> {
  return cachedBoilerplates;
}

export function findBoilerplate(module: Module): EvalBoilerplate {
  const boilerplates = getBoilerplates();
  const boilerplate = boilerplates.find((b) => {
    const regex = new RegExp(b.condition);
    return regex.test(module.title);
  });

  if (boilerplate == null) {
    throw new Error(`No boilerplate found for ${module.title}, you can create one in the future`);
  }

  return boilerplate;
}
