import type { Module } from 'sandpack-core/lib/types/module';
import { ChildHandler } from '../worker-transpiler/child-handler';

export async function getModulesFromMainThread(opts: {
  childHandler: ChildHandler;
  loaderContextId: number;
}): Promise<Module[]> {
  const { childHandler, loaderContextId } = opts;
  if (loaderContextId == null) {
    throw new Error('Loader context id is required');
  }

  const { modules } = await childHandler.callFn({
    method: 'resolve-fs',
    data: {
      loaderContextId,
    },
  });
  return modules;
}
