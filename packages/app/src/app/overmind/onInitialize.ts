import { OnInitialize } from '.';

export const onInitialize: OnInitialize = (
  { state, effects, actions },
  overmindInstance
) => {
  const provideJwtToken = () => state.jwt || effects.jwt.get();

  effects.fsSync.initialize({
    onModulesByPathChange(cb: (modulesByPath: any) => void) {
      overmindInstance.reaction(
        ({ editor }) => editor.modulesByPath,
        modulesByPath => cb(modulesByPath)
      );
    },
    getModulesByPath() {
      return state.editor.modulesByPath;
    },
  });

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
};
