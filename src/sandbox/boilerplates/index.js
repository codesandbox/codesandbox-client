// @flow
import type { Module, Directory } from 'common/types';

import { getCurrentManager } from '../';

let cachedBoilerplates = [];

export async function evalBoilerplates(boilerplates: Array<any>) {
  cachedBoilerplates = await Promise.all(
    boilerplates.map(async boilerplate => {
      const fakeModule: Module = {
        id: boilerplate.id,
        shortid: boilerplate.id,
        title: `boilerplate-${boilerplate.condition}${boilerplate.extension}`,
        code: boilerplate.code,
        directoryShortid: null,
        sourceId: boilerplate.sourceId,
        isNotSynced: false,
        type: '',
      };

      const manager = getCurrentManager();

      await manager.transpileModules(fakeModule);
      const module = manager.evaluateModule(fakeModule);

      return { ...boilerplate, module };
    })
  );
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
      `No boilerplate found for ${module.title}, you can create one in the future`
    );
  }

  return boilerplate;
}
