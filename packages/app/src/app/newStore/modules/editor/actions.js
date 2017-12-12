import { clone } from 'mobx-state-tree';

export function deleteSandbox() {
  // TODO: waiting for modal
}

export function ensureValidPrivacy({ props, path }) {
  const privacy = Number(props.privacy);

  return Number.isNaN(privacy) ? path.invalid() : path.valid({ privacy });
}

export function updatePrivacy({ api, props, state }) {
  const id = state.get('editor.currentId');

  return api
    .patch(`/sandboxes/${id}/privacy`, {
      sandbox: {
        privacy: props.privacy,
      },
    })
    .then(() => undefined);
}

export function setUrlOptions({ state, router, utils }) {
  const options = router.getSandboxOptions();

  if (options.currentModule) {
    const sandbox = state.get('editor.currentSandbox');
    const module = utils.resolveModule(
      options.currentModule,
      sandbox.modules,
      sandbox.directories
    );

    if (module) {
      state.set('editor.currentModuleShortid');
    }
  }

  state.merge(
    'editor.preferences.showPreview',
    options.isPreviewScreen || options.isSplitScreen
  );
  state.merge(
    'editor.preferences.showEditor',
    options.isEditorScreen || options.isSplitScreen
  );

  if (options.initialPath) state.set('editor.initialPath', options.initialPath);
  if (options.fontSize)
    state.set('editor.preferences.settings.fontSize', options.fontSize);
  if (options.highlightedLines)
    state.set('editor.highlightedLines', options.highlightedLines);
  if (options.editorSize)
    state.set('editor.preferences.settings.editorSize', options.editorSize);
  if (options.hideNavigation)
    state.set('editor.preferences.hideNavigation', options.hideNavigation);
  if (options.isInProjectView)
    state.set('editor.isInProjectView', options.isInProjectView);
  if (options.autoResize)
    state.set('editor.preferences.settings.autoResize', options.autoResize);
  if (options.useCodeMirror)
    state.set(
      'editor.preferences.settings.useCodeMirror',
      options.useCodeMirror
    );
  if (options.enableEslint)
    state.set('editor.preferences.settings.enableEslint', options.enableEslint);
  if (options.forceRefresh)
    state.set('editor.preferences.settings.forceRefresh', options.forceRefresh);
  if (options.expandDevTools)
    state.set('editor.preferences.showConsole', options.expandDevTools);
}

export function forceRender({ state }) {
  state.set('editor.forceRender', state.get('editor.forceRender') + 1);
}

export function addNpmDependency({ api, state, props }) {
  const sandboxId = state.get('editor.currentId');

  return api
    .post(`/sandboxes/${sandboxId}/dependencies`, {
      dependency: {
        name: props.name,
        version: props.version,
      },
    })
    .then(data => ({ npmDependencies: data }));
}

export function outputModuleIdFromActionPath({ state, props, utils }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = utils.resolveModule(
    props.action.path.replace(/^\//, ''),
    sandbox.modules,
    sandbox.directories
  );

  return { id: module ? module.id : null };
}

export function renameModuleFromPreview({ state, props, utils }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = utils.resolveModule(
    props.action.path.replace(/^\//, ''),
    sandbox.modules,
    sandbox.directories
  );

  if (module) {
    const moduleIndex = sandbox.modules.findIndex(
      moduleEntry => moduleEntry.id === module.id
    );

    state.set(
      `editor.sandboxes.${sandbox.id}.modules.${moduleIndex}.title`,
      props.title
    );
  }
}

export function addErrorFromPreview({ state, props, utils }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = utils.resolveModule(
    props.action.path.replace(/^\//, ''),
    sandbox.modules,
    sandbox.directories
  );
  const error = {
    moduleId: module.id,
    column: props.action.column,
    line: props.action.line,
    message: props.action.message,
    title: props.action.title,
  };

  if (module) {
    state.push('editor.errors', error);
  }
}

export function addCorrectionFromPreview({ state, props, utils }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = utils.resolveModule(
    props.action.path.replace(/^\//, ''),
    sandbox.modules,
    sandbox.directories
  );
  const correction = {
    moduleId: module.id,
    column: props.action.column,
    line: props.action.line,
    message: props.action.message,
    source: props.action.source,
  };

  if (module) {
    state.push('editor.corrections', correction);
  }
}

export function moveTab({ state, props }) {
  const tabs = state.get('editor.tabs');
  const tab = clone(tabs[props.prevIndex]);

  state.splice('editor.tabs', props.prevIndex, 1);
  state.splice('editor.tabs', props.nextIndex, 0, tab);
}

export function closeTab({ state, props }) {
  const sandbox = state.get('editor.currentSandbox');
  const currentModule = state.get('editor.currentModule');
  const tabs = state.get('editor.tabs');

  if (tabs.length === 1) {
    return;
  }

  const tabModuleId = tabs[props.tabIndex].moduleId;
  const isActiveTab = currentModule.id === tabModuleId;

  if (isActiveTab) {
    const newTab =
      props.tabIndex > 0 ? tabs[props.tabIndex - 1] : tabs[props.tabIndex + 1];

    if (newTab) {
      const newModule = sandbox.modules.find(
        module => module.id === newTab.moduleId
      );

      state.set('editor.currentModuleShortid', newModule.shortid);
    }
  }

  state.splice('editor.tabs', props.tabIndex, 1);
}

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

  const tabIndex = tabs.findIndex(tab => tab.moduleId === currentModule.id);

  if (tabs.length === 0) {
    tabs = [newTab];
  } else if (!tabs.some(tab => tab.moduleId === props.id)) {
    const notDirtyTabs = tabs.filter(tab => !tab.dirty);

    tabs = [
      ...notDirtyTabs.slice(0, tabIndex + 1),
      newTab,
      ...notDirtyTabs.slice(tabIndex + 1),
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

export function prettifyCode({ utils, state }) {
  const currentModule = state.get('editor.currentModule');

  return utils
    .prettify(currentModule.title, currentModule.code)
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
  const module = utils.resolveModule(
    props.sandbox.entry,
    props.sandbox.modules,
    props.sandbox.directories
  );

  state.set('editor.currentModuleShortid', module.shortid);
}

export function setMainModuleShortid({ utils, props, state }) {
  const module = utils.resolveModule(
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
