import { Action } from 'app/overmind';
import { Sandbox } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';

export const refetchSandboxInfo: Action = async ({
  state,
  effects,
  actions,
}) => {
  if (state.editor.currentId) {
    try {
      const sandbox = await effects.api.get<Sandbox>(
        `/sandboxes/${state.editor.currentId}`
      );

      actions.editor.internal.setSandboxData({
        sandbox,
        noOverWriteFiles: true,
      });

      if (state.live.isLive) {
        actions.live.internal.disconnect();
      }

      actions.editor.internal.joinLiveSessionIfAvailable();
    } catch (error) {
      console.error(error.message);
    }
  }
};

export const setSandboxData: Action<{
  sandbox: Sandbox;
  noOverWriteFiles: boolean;
}> = ({ state }, { sandbox, noOverWriteFiles }) => {
  if (noOverWriteFiles) {
    state.editor.currentSandbox.collection = sandbox.collection;
    state.editor.currentSandbox.owned = sandbox.owned;
    state.editor.currentSandbox.userLiked = sandbox.userLiked;
    state.editor.currentSandbox.title = sandbox.title;
    state.editor.currentSandbox.team = sandbox.team;
  } else {
    state.editor.sandboxes[sandbox.id] = sandbox;
  }
};

export const joinLiveSessionIfAvailable: Action = async ({
  state,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;

  // Was originally a lot of setting of the sandbox here, but dunno why?
  if (sandbox.owned && sandbox.roomId) {
    if (sandbox.team) {
      state.live.isTeam = true;
    }

    await actions.live.internal.initialize();
  } else if (sandbox.owned) {
    actions.editor.internal.recoverFiles();
  }
};

export const recoverFiles: Action = ({ state, effects, actions }) => {
  const sandbox = state.editor.currentSandbox;

  const recoverList = effects.moduleRecover.getRecoverList(
    sandbox.id,
    sandbox.modules
  );
  effects.moduleRecover.clearSandbox(sandbox.id);

  const recoveredList = recoverList
    .map(({ recoverData, module }) => {
      if (module.code === recoverData.savedCode) {
        const titleA = `saved '${module.title}'`;
        const titleB = `recovered '${module.title}'`;

        state.editor.tabs.push({
          type: 'DIFF',
          codeA: module.code || '',
          codeB: recoverData.code || '',
          titleA,
          titleB,
          fileTitle: module.title,
          id: `${titleA} - ${titleB}`,
        });

        actions.editor.codeChanged({
          code: recoverData.code,
          moduleShortid: module.shortid,
        });

        return true;
      }

      return false;
    })
    .filter(Boolean);

  if (recoveredList.length > 0) {
    effects.analytics.track('Files Recovered', {
      fileCount: recoveredList.length,
    });

    effects.notificationToast.add({
      message: `We recovered ${
        recoveredList.length
      } unsaved files from a previous session`,
      status: NotificationStatus.NOTICE,
    });
  }
};
