import resolveModule from 'common/sandbox/resolve-module';

export function getSandbox({ props, api, path }) {
  return api
    .get(`/sandboxes/${props.id}`)
    .then(data => path.success({ sandbox: data }))
    .catch(error => {
      if (error.response.status === 404) {
        return path.notFound();
      }

      return path.error({ error });
    });
}

export function warnUnloadingContent({ browser, state }) {
  browser.onUnload(event => {
    if (!state.get('editor.isAllModulesSynced')) {
      const returnMessage =
        'You have not saved all your modules, are you sure you want to close this tab?';

      event.returnValue = returnMessage; // eslint-disable-line

      return returnMessage;
    }

    return null;
  });
}

export function setCurrentModuleId({ props, state }) {
  const module = resolveModule(
    props.sandbox.entry,
    props.sandbox.modules,
    props.sandbox.directories
  );

  state.set('editor.currentModuleShortid', module.shortid);
}

export function forkSandbox({ state, api }) {
  return api
    .post(`/sandboxes/${state.get('editor.currentId')}/fork`)
    .then(data => ({ forkedSandbox: data }));
}

export function moveModuleContent({ props, state }) {
  const currentSandbox = state.get('editor.currentSandbox');

  return {
    sandbox: Object.assign({}, props.forkedSandbox, {
      modules: props.forkedSandbox.modules.map(module =>
        Object.assign(module, {
          code: currentSandbox.modules.find(
            currentSandboxModule =>
              currentSandboxModule.shortid === module.shortid
          ).code,
        })
      ),
    }),
  };
}

export function setCode({ props, state }) {
  const currentId = state.get('editor.currentId');
  const moduleIndex = state
    .get('editor.currentSandbox')
    .modules.findIndex(module => module.id === props.moduleId);

  state.set(
    `editor.sandboxes.${currentId}.modules.${moduleIndex}.code`,
    props.code
  );
}
