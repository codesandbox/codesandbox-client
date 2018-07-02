import { Provider } from 'cerebral';

const getKey = (id, moduleShortid) => `recover:${id}:${moduleShortid}:code`;

export default Provider({
  save(currentId, version, module, code, savedCode) {
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

  remove(currentId, module) {
    try {
      localStorage.removeItem(getKey(currentId, module.shortid));
    } catch (e) {
      // Too bad
    }
  },

  clearSandbox(currentId) {
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

  getRecoverList(currentId, modules) {
    const localKeys = Object.keys(localStorage).filter(key =>
      key.startsWith(`recover:${currentId}`)
    );

    return modules
      .filter(m => localKeys.indexOf(getKey(currentId, m.shortid) > -1))
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
});
