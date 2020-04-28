import { NotificationStatus } from '@codesandbox/notifications';
import { OnInitialize } from '.';

export const onInitialize: OnInitialize = async (
  { state, effects, actions },
  overmindInstance
) => {
  const provideJwtToken = () => state.jwt || effects.jwt.get();
  const seenTermsKey = 'ACCEPTED_TERMS_CODESANDBOX';

  state.isFirstVisit = Boolean(
    !effects.jwt.get() && !effects.browser.storage.get('hasVisited')
  );

  effects.browser.storage.set('hasVisited', true);

  effects.live.initialize({
    provideJwtToken,
    onApplyOperation: actions.live.applyTransformation,
    isLiveBlockerExperiement: () =>
      Boolean(state.user?.experiments.liveBlocker),
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
    provideJwtToken,
    getParsedConfigurations() {
      return state.editor.parsedConfigurations;
    },
  });

  effects.gql.initialize(
    {
      endpoint: `${location.origin}/api/graphql`,
      headers: () => ({
        Authorization: `Bearer ${state.jwt}`,
      }),
    },
    () => (effects.jwt.get() ? effects.live.getSocket() : null)
  );

  effects.notifications.initialize({
    provideSocket() {
      return effects.live.getSocket();
    },
  });

  effects.zeit.initialize({
    getToken() {
      return state.user?.integrations.zeit?.token ?? null;
    },
  });

  effects.netlify.initialize({
    getUserId() {
      return state.user?.id ?? null;
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

  effects.preview.initialize(overmindInstance.reaction);

  // show terms message on first visit since new terms
  if (!effects.browser.storage.get(seenTermsKey) && !state.isFirstVisit) {
    effects.analytics.track('Saw Privacy Policy Notification');
    effects.notificationToast.add({
      message:
        'Hello, our privacy policy has been updated recently. What’s new? CodeSandbox emails. Please read and reach out.',
      title: 'Updated Privacy',
      status: NotificationStatus.NOTICE,
      sticky: true,
      actions: {
        primary: [
          {
            label: 'Open Privacy Policy',
            run: () => {
              window.open('https://codesandbox.io/legal/privacy', '_blank');
            },
          },
        ],
      },
    });
  }
  effects.browser.storage.set(seenTermsKey, true);
};
