import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { Module } from 'sandpack-core/lib/types/module';

let lastSendId = 0;
export function getModulesFromMainThread(): Promise<Module[]> {
  return new Promise(resolve => {
    const g: Worker = getGlobal();

    const sendId = lastSendId++;

    const resolveWaiter = e => {
      const { id, type, modules } = e.data;
      if (type === 'resolve-fs-response' && id === sendId) {
        g.removeEventListener('message', resolveWaiter);
        resolve(modules);
      }
    };

    g.addEventListener('message', resolveWaiter);
    g.postMessage({ type: 'resolve-fs', id: sendId });
  });
}
