import { Module } from '@codesandbox/common/lib/types';

const getKey = (id: string, moduleShortid: string) =>
  `recover:${id}:${moduleShortid}:code`;

export type RecoverData = {
  code: string;
  version: number;
  timestamp: number;
  sandboxId: string;
};

export default {
  save(sandboxId: string, version: number, module: Module) {
    try {
      localStorage.setItem(
        getKey(sandboxId, module.shortid),
        JSON.stringify({
          code: module.code,
          version,
          timestamp: new Date().getTime(),
          sandboxId,
        })
      );
    } catch (e) {
      // Too bad
    }
  },

  get(sandboxId: string, moduleShortid: string): RecoverData | null {
    return JSON.parse(
      localStorage.getItem(getKey(sandboxId, moduleShortid)) || 'null'
    );
  },

  remove(sandboxId: string, module: Module) {
    try {
      const recoverData = this.get(sandboxId, module.shortid);
      if (recoverData && recoverData.code === module.code) {
        localStorage.removeItem(getKey(sandboxId, module.shortid));
      }
    } catch (e) {
      // Too bad
    }
  },

  clearSandbox(sandboxId: string) {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(`recover:${sandboxId}`))
        .forEach(key => {
          localStorage.removeItem(key);
        });
    } catch (e) {
      // Too bad
    }
  },

  getRecoverList(sandboxId: string, modules: Module[]) {
    const localKeys = Object.keys(localStorage).filter(key =>
      key.startsWith(`recover:${sandboxId}`)
    );

    return modules
      .filter(m => localKeys.includes(getKey(sandboxId, m.shortid)))
      .map(module => {
        const key = getKey(sandboxId, module.shortid);

        try {
          const recoverData: RecoverData = JSON.parse(
            localStorage.getItem(key) || 'null'
          );

          if (recoverData) {
            return { recoverData, module };
          }
        } catch (e) {
          // Too bad
        }

        return null;
      })
      .filter(Boolean) as Array<{ recoverData: RecoverData; module: Module }>;
  },
};
