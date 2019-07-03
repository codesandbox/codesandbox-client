import { AsyncAction, Action } from 'app/overmind';
import { Module } from '@codesandbox/common/lib/types';
import { json } from 'overmind';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';

export const recoverFiles: Action = ({ effects, actions, state }) => {
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

  return {};
};

export const saveNewModule: AsyncAction<
  {
    module: Module;
    newCode?: string;
  },
  Module
> = async ({ state, effects }, { module, newCode }) => {
  const sandboxId = state.editor.currentId;

  return effects.api.post<Module>(`/sandboxes/${sandboxId}/modules`, {
    module: {
      title: module.title,
      directoryShortid: module.directoryShortid,
      code: newCode || '',
      isBinary: module.isBinary === undefined ? false : module.isBinary,
    },
  });
};

export const createOptimisticModule: Action<
  {
    title: string;
    newCode?: string;
    directoryShortid?: string;
    isBinary?: boolean;
  },
  Module
> = ({ state, effects }, { title, directoryShortid, isBinary, newCode }) => {
  return {
    id: effects.utils.createOptimisticId(),
    title: title,
    directoryShortid: directoryShortid || null,
    code: newCode || '',
    shortid: effects.utils.createOptimisticId(),
    isBinary: isBinary === undefined ? false : isBinary,
    sourceId: state.editor.currentSandbox.sourceId,
    insertedAt: new Date().toString(),
    updatedAt: new Date().toString(),
    isNotSynced: true,
  };
};

export const updateOptimisticModule: Action<{
  optimisticModule: Module;
  updatedModule: Module;
}> = ({ state }, { optimisticModule, updatedModule }) => {
  const sandbox = state.editor.currentSandbox;
  let optimisticModuleIndex = sandbox.modules.findIndex(
    module => module.shortid === optimisticModule.shortid
  );

  const existingModule =
    state.editor.sandboxes[sandbox.id].modules[optimisticModuleIndex];

  const newModule = {
    ...existingModule,
    id: updatedModule.id,
    shortid: updatedModule.shortid,
  };

  state.editor.sandboxes[sandbox.id].modules.push(newModule);

  if (state.editor.currentModuleShortid === optimisticModule.shortid) {
    state.editor.currentModuleShortid = updatedModule.shortid;
  }

  optimisticModuleIndex = sandbox.modules.findIndex(
    module => module.shortid === optimisticModule.shortid
  );

  state.editor.sandboxes[sandbox.id].modules.splice(optimisticModuleIndex, 1);
};

export const removeModule: Action<string, Module> = (
  { state },
  moduleShortid
) => {
  const sandboxId = state.editor.currentId;
  const sandbox = state.editor.currentSandbox;
  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.shortid === moduleShortid
  );
  const moduleCopy = json(sandbox.modules[moduleIndex]);

  state.editor.sandboxes[sandboxId].modules.splice(moduleIndex, 1);

  return moduleCopy;
};
