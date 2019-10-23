import { OnInitialize } from '.';

export const onInitialize: OnInitialize = async (
  { state, effects, actions },
  overmindInstance
) => {
  const provideJwtToken = () => state.jwt || effects.jwt.get();

  effects.live.initialize({
    provideJwtToken,
    onApplyOperation: actions.live.applyTransformation,
  });

  effects.keybindingManager.initialize(overmindInstance);

  effects.api.initialize({
    provideJwtToken,
    onError(error) {
      effects.notificationToast.error(error);
    },
    getParsedConfigurations() {
      return state.editor.parsedConfigurations;
    },
    getModulesByPath() {
      return state.editor.modulesByPath;
    },
  });

  effects.notifications.initialize({
    provideSocket() {
      return effects.live.getSocket();
    },
  });

  effects.zeit.initialize({
    getToken() {
      return state.user.integrations.zeit && state.user.integrations.zeit.token;
    },
  });

  effects.netlify.initialize({
    getUserId() {
      return state.user.id;
    },
  });

  effects.prettyfier.initialize({
    getCurrentModule() {
      return state.editor.currentModule;
    },
    getPrettierConfig() {
      let config = state.preferences.settings.prettierConfig;
      const configFromSandbox = state.editor.currentSandbox.modules.find(
        module =>
          module.directoryShortid == null && module.title === '.prettierrc'
      );

      if (configFromSandbox) {
        config = JSON.parse(configFromSandbox.code);
      }

      return config;
    },
  });

  effects.vscode.initialize({
    getCurrentSandbox: () => state.editor.currentSandbox,
    getCurrentModule: () => state.editor.currentModule,
    onCodeChange: actions.editor.codeChanged,
    onSelectionChange: () => {},
    reaction: overmindInstance.reaction,
    getState: path =>
      path ? path.split('.').reduce((aggr, key) => aggr[key], state) : state,
    getSignal: path =>
      path.split('.').reduce((aggr, key) => aggr[key], actions),
  });

  /*
sendTransforms={operation => {
    
                }}
                onCodeReceived={actions.live.onCodeReceived}
                onSelectionChanged={actions.live.onSelectionChanged}
                onNpmDependencyAdded={name => {
                  if (sandbox.owned) {
                    actions.editor.addNpmDependency({ name, isDev: true });
                  }
                }}
                onChange={(code, moduleShortid) =>
                  actions.editor.codeChanged({
                    code,
                    moduleShortid: moduleShortid || currentModule.shortid,
                    noLive: true,
                  })
                }
                onModuleChange={moduleId =>
                  actions.editor.moduleSelected({ id: moduleId })
                }
                onModuleStateMismatch={actions.live.onModuleStateMismatch}
                onSave={code =>
                  actions.editor.codeSaved({
                    code,
                    moduleShortid: currentModule.shortid,
                    cbID: null,
                  })
                }
      */

  /*
    When VSCode is running from within effect we can call an action here
    instead which manages the state to optimally load up and show the editor,
    not blocking anything else
  */
  await effects.fsSync.initialize({
    onModulesByPathChange(cb: (modulesByPath: any) => void) {
      overmindInstance.reaction(
        ({ editor }) => editor.modulePaths,
        modulesByPath => cb(modulesByPath)
      );
    },
    getModulesByPath() {
      return state.editor.modulesByPath;
    },
  });
};
