import { Module } from '@codesandbox/common/lib/types';

const getKey = (id, moduleShortid) => `recover:${id}:${moduleShortid}:code`;

export default {
  save(
    currentId: string,
    version: number,
    module: Module,
    code: string,
    savedCode: string | null
  ) {
    try {
      localStorage.setItem(
        getKey(currentId, module.shortid),
        JSON.stringify({
          code,
          savedCode,
          version,
          timestamp: new Date().getTime(),
          sandboxId: currentId,
        })
      );
    } catch (e) {
      // Too bad
    }
  },

  remove(currentId: string, module: Module) {
    try {
      localStorage.removeItem(getKey(currentId, module.shortid));
    } catch (e) {
      // Too bad
    }
  },

  clearSandbox(currentId: string) {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(`recover:${currentId}`))
        .forEach(key => {
          localStorage.removeItem(key);
        });
    } catch (e) {
      // Too bad
    }
  },

  getRecoverList(currentId: string, modules: Module[]) {
    const localKeys = Object.keys(localStorage).filter(key =>
      key.startsWith(`recover:${currentId}`)
    );

    return modules
      .filter(m => localKeys.includes(getKey(currentId, m.shortid)))
      .map(module => {
        const key = getKey(currentId, module.shortid);

        try {
          const recoverData = JSON.parse(localStorage.getItem(key));
          if (recoverData && recoverData.code !== module.code) {
            return { recoverData, module };
          }
        } catch (e) {
          // Too bad
        }

        return null;
      })
      .filter(Boolean);
  },
};
