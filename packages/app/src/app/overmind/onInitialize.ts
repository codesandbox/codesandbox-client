import { OnInitialize } from '.';

export const onInitialize: OnInitialize = async (
  { state, effects, actions },
  overmindInstance
) => {
  const provideJwtToken = () => effects.api.getJWTToken();

  state.isFirstVisit = Boolean(
    !state.hasLogIn && !effects.browser.storage.get('hasVisited')
  );

  effects.browser.storage.set('hasVisited', true);

  effects.live.initialize({
    provideJwtToken,
    onApplyOperation: actions.live.applyTransformation,
    onOperationError: actions.live.onOperationError,
  });

  effects.flows.initialize(overmindInstance.reaction);

  // We consider recover mode something to be done when browser actually crashes, meaning there is no unmount
  effects.browser.onUnload(() => {
    if (state.editor.currentSandbox && state.connected) {
      effects.moduleRecover.clearSandbox(state.editor.currentSandbox.id);
    }
  });

  effects.api.initialize({
    getParsedConfigurations() {
      return state.editor.parsedConfigurations;
    },
    provideJwtToken() {
      if (process.env.LOCAL_SERVER || process.env.STAGING) {
        return localStorage.getItem('devJwt');
      }
      return null;
    },
  });

  const hasDevAuth = process.env.LOCAL_SERVER || process.env.STAGING;
  const gqlOptions: Parameters<typeof effects.gql.initialize>[0] = {
    endpoint: `${location.origin}/api/graphql`,
  };

  if (hasDevAuth) {
    gqlOptions.headers = () => ({
      Authorization: `Bearer ${localStorage.getItem('devJwt')}`,
    });
  }

  effects.gql.initialize(gqlOptions, () => effects.live.socket);

  if (state.hasLogIn) {
    await actions.internal.setActiveTeamFromUrlOrStore();
  }

  effects.notifications.initialize({
    provideSocket() {
      return effects.live.getSocket();
    },
  });

  effects.vercel.initialize({
    getToken() {
      return state.user?.integrations.zeit?.token ?? null;
    },
  });
  effects.netlify.initialize({
    getUserId() {
      return state.user?.id ?? null;
    },
    provideJwtToken() {
      if (process.env.LOCAL_SERVER || process.env.STAGING) {
        return Promise.resolve(localStorage.getItem('devJwt'));
      }

      return provideJwtToken();
    },
  });

  effects.prettyfier.initialize({
    getCurrentModule() {
      return state.editor.currentModule;
    },
    getPrettierConfig() {
      let config = state.preferences.settings.prettierConfig;
      const configFromSandbox = state.editor.currentSandbox?.modules.find(
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
    getSandboxFs: () => state.editor.modulesByPath,
    getCurrentUser: () => state.user,
    onOperationApplied: actions.editor.onOperationApplied,
    onCodeChange: actions.editor.codeChanged,
    onSelectionChanged: selection => {
      actions.editor.onSelectionChanged(selection);
      actions.live.onSelectionChanged(selection);
    },
    onViewRangeChanged: actions.live.onViewRangeChanged,
    onCommentClick: actions.comments.onCommentClick,
    reaction: overmindInstance.reaction,
    getState: (path: string) =>
      path ? path.split('.').reduce((aggr, key) => aggr[key], state) : state,
    getSignal: (path: string) =>
      path.split('.').reduce((aggr, key) => aggr[key], actions),
  });

  effects.preview.initialize();

  actions.internal.showPrivacyPolicyNotification();
  actions.internal.setViewModeForDashboard();

  effects.browser.onWindowMessage(event => {
    if (event.data.type === 'screenshot-requested-from-preview') {
      actions.preview.createPreviewComment();
    }
  });

  effects.browserExtension.hasExtension().then(hasExtension => {
    actions.preview.setExtension(hasExtension);
  });
};
