// @flow
import type { Module } from '../eval/entities/module';

import { getCurrentManager } from '../compile';
import defaultBoilerplates from './default-boilerplates';

const cachedBoilerplates = [];

export async function evalBoilerplate(boilerplate) {
  const fakeModule: Module = {
    path: `/boilerplate-${boilerplate.condition}${boilerplate.extension}`,
    code: boilerplate.code,
  };

  const manager = getCurrentManager();

  await manager.transpileModules(fakeModule);
  const module = manager.evaluateModule(fakeModule);

  const cachedBoilerplate = { ...boilerplate, module };

  cachedBoilerplates.push(cachedBoilerplate);

  return cachedBoilerplate;
}

export function getBoilerplates(): Array<any> {
  return cachedBoilerplates;
}

export function findBoilerplate(module: Module): any {
  const cachedBoilerplate = cachedBoilerplates.find(b => {
    const regex = new RegExp(b.condition);
    return regex.test(module.path);
  });

  const boilerplate = defaultBoilerplates.find(b => {
    const regex = new RegExp(b.condition);
    return regex.test(module.path);
  });

  return cachedBoilerplate || boilerplate;
}
