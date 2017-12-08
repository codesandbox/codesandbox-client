export function unsetDirtyTab({ state }) {
  const currentModule = state.get('editor.currentModule');
  const tabs = state.get('editor.tabs');
  const tabIndex = tabs.findIndex(tab => tab.moduleId === currentModule.id);

  state.set(`editor.tabs.${tabIndex}.dirty`, false);
}

export function setInitialTab({ state }) {
  const currentModule = state.get('editor.currentModule');
  const newTab = {
    type: 'MODULE',
    moduleId: currentModule.id,
    dirty: true,
  };

  state.set('editor.tabs', [newTab]);
}

export function addTab({ state, props }) {
  const currentModule = state.get('editor.currentModule');
  const newTab = {
    type: 'MODULE',
    moduleId: props.id,
    dirty: true,
  };
  let tabs = state.get('editor.tabs');

  const currentTabPos = tabs.findIndex(
    tab => tab.moduleId === currentModule.id
  );

  if (tabs.length === 0) {
    tabs = [newTab];
  } else if (!tabs.some(tab => tab.moduleId === props.id)) {
    const notDirtyTabs = tabs.filter(tab => !tab.dirty);

    tabs = [
      ...notDirtyTabs.slice(0, currentTabPos + 1),
      newTab,
      ...notDirtyTabs.slice(currentTabPos + 1),
    ];
  }

  state.set('editor.tabs', tabs);
}

export function setCurrentModule({ props, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.id === props.id
  );

  state.set('editor.currentModuleShortid', module.shortid);
}

export function outputChangedModules({ state }) {
  const changedModuleShortids = state.get('editor.changedModuleShortids');
  const sandbox = state.get('editor.currentSandbox');

  return {
    changedModules: sandbox.modules.filter(
      module => changedModuleShortids.indexOf(module.shortid) >= 0
    ),
  };
}

export function confirmForkingOwnSandbox({ browser, path }) {
  return browser.confirm('Do you want to fork your own sandbox?')
    ? path.confirmed()
    : path.cancelled();
}

export function unlikeSandbox({ api, state }) {
  const id = state.get('editor.currentId');

  return api.request({
    method: 'DELETE',
    url: `/sandboxes/${id}/likes`,
    body: {
      id,
    },
  });
}

export function likeSandbox({ api, state }) {
  const id = state.get('editor.currentId');

  return api.post(`/sandboxes/${id}/likes`, {
    id,
  });
}

export function createZip({ utils, state }) {
  const sandbox = state.get('editor.currentSandbox');

  utils.zipSandbox(sandbox);
}

export function addChangedModule({ state }) {
  const currentModuleShortid = state.get('editor.currentModuleShortid');

  if (
    state.get('editor.changedModuleShortids').indexOf(currentModuleShortid) ===
    -1
  ) {
    state.push('editor.changedModuleShortids', currentModuleShortid);
  }
}

export function saveChangedModules({ props, api, state }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .put(`/sandboxes/${sandboxId}/modules/mupdate`, {
      modules: props.changedModules,
    })
    .then(() => undefined);
}

export function prettifyCode({ props, utils, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const moduleToSave = sandbox.modules.find(
    module => module.id === props.moduleId
  );

  return utils
    .prettify(moduleToSave.title, moduleToSave.code)
    .then(newCode => ({ code: newCode }));
}

export function saveModuleCode({ state, api }) {
  const sandbox = state.get('editor.currentSandbox');
  const moduleShortid = state.get('editor.currentModuleShortid');
  const moduleToSave = sandbox.modules.find(
    module => module.shortid === moduleShortid
  );

  return api.put(`/sandboxes/${sandbox.id}/modules/${moduleToSave.shortid}`, {
    module: { code: moduleToSave.code },
  });
}

export function getCurrentModuleId({ state }) {
  const currentModuleShortid = state.get('editor.currentModuleShortid');
  const sandbox = state.get('editor.currentSandbox');

  return {
    moduleId: sandbox.modules.find(
      module => module.shortid === currentModuleShortid
    ).id,
  };
}

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

export function setCurrentModuleShortid({ utils, props, state }) {
  const module = utils.resolveMainModule(
    props.sandbox.entry,
    props.sandbox.modules,
    props.sandbox.directories
  );

  state.set('editor.currentModuleShortid', module.shortid);
}

export function setMainModuleShortid({ utils, props, state }) {
  const module = utils.resolveMainModule(
    props.sandbox.entry,
    props.sandbox.modules,
    props.sandbox.directories
  );

  state.set('editor.mainModuleShortid', module.shortid);
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
  const moduleShortid = state.get('editor.currentModuleShortid');
  const moduleIndex = state
    .get('editor.currentSandbox')
    .modules.findIndex(module => module.shortid === moduleShortid);

  state.set(
    `editor.sandboxes.${currentId}.modules.${moduleIndex}.code`,
    props.code
  );
}
