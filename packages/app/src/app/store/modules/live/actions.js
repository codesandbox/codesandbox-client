import { TextOperation } from 'ot';
import { camelizeKeys } from 'humps';

import { getTextOperation } from 'common/lib/utils/diff';

export function createRoom({ api, props }) {
  const id = props.sandboxId;

  return api
    .post(`/sandboxes/${id}/live`, {
      id,
    })
    .then(({ id: roomId }) => ({ roomId }));
}

export function disconnect({ live, ot }) {
  ot.reset();
  live.disconnect();
}

export function joinChannel({ props, live, path }) {
  return live
    .joinChannel(props.roomId)
    .then(res => path.success(camelizeKeys(res)))
    .catch(res => path.error(camelizeKeys(res)));
}

export function listen({ props, live }) {
  live.listen(props.listenSignalPath);
}

export function consumeModuleState({ props }) {
  return {
    moduleState: camelizeKeys(props.data.module_state),
  };
}

export function initializeModuleState({ props, state, ot }) {
  Object.keys(props.moduleState).forEach(moduleShortid => {
    const moduleInfo = props.moduleState[moduleShortid];
    ot.initializeModule(moduleShortid, moduleInfo.revision);

    // Module has not been saved, so is different
    const index = state
      .get(`editor.currentSandbox.modules`)
      .findIndex(m => m.shortid === moduleShortid);
    if (index > -1) {
      if (moduleInfo.code != null) {
        state.set(
          `editor.currentSandbox.modules.${index}.code`,
          moduleInfo.code
        );
      }
      if (!moduleInfo.synced) {
        state.push(`editor.changedModuleShortids`, moduleShortid);
      }
    }
  });
}

export function sendSelection({ props, state, live }) {
  const liveUserId = state.get('live.liveUserId');
  const userIndex = state
    .get('live.roomInfo.users')
    .findIndex(u => u.id === liveUserId);

  if (userIndex > -1) {
    const moduleShortid = props.moduleShortid;
    const selection = props.selection;

    if (state.get(`live.roomInfo.users.${userIndex}`)) {
      state.set(
        `live.roomInfo.users.${userIndex}.currentModuleShortid`,
        moduleShortid
      );
      state.set(`live.roomInfo.users.${userIndex}.selection`, selection);

      live.send('user:selection', {
        liveUserId,
        moduleShortid,
        selection,
      });
    }
  }
}

export function consumeUserState({ props }) {
  const users = camelizeKeys(props.data.users);

  return { users };
}

export function updateSelection({ props, state }) {
  const liveUserId = props.data.liveUserId;
  const moduleShortid = props.data.moduleShortid;
  const selection = props.data.selection;
  const userIndex = state
    .get('live.roomInfo.users')
    .findIndex(u => u.id === liveUserId);

  if (userIndex > -1) {
    state.set(
      `live.roomInfo.users.${userIndex}.currentModuleShortid`,
      moduleShortid
    );
    state.set(`live.roomInfo.users.${userIndex}.selection`, selection);
  }

  return {
    liveUserId,
    moduleShortid,
    selection,
  };
}

export function getSelectionsForCurrentModule({ state }) {
  const selections = [];
  const moduleShortid = state.get('editor.currentModuleShortid');

  state.get('live.roomInfo.users').forEach(user => {
    const userId = user.id;
    if (
      userId === state.get('live.liveUserId') ||
      user.currentModuleShortid !== moduleShortid ||
      !state.get('live.isEditor')(userId)
    ) {
      return;
    }

    if (user.selection) {
      selections.push({
        userId,
        color: user.color.toJS(),
        name: user.username,
        selection: user.selection.toJSON(),
      });
    }
  });

  return { selections };
}

export function sendSelectionToEditor({ props, state }) {
  const userId = props.liveUserId;
  const moduleShortid = props.moduleShortid;
  const selection = props.selection;

  if (
    moduleShortid === state.get('editor.currentModuleShortid') &&
    state.get('live.isEditor')(userId)
  ) {
    const user = state.get('live.roomInfo.users').find(u => u.id === userId);

    state.push('editor.pendingUserSelections', {
      userId,
      name: user.username,
      selection,
      color: user.color.toJS(),
    });
  }
}

function sendModuleInfo(
  { state, live },
  event: string,
  type: 'module' | 'directory',
  moduleShortid,
  { sendModule = true } = {}
) {
  if (state.get('live.isCurrentEditor')) {
    const message = {
      type,
    };
    if (sendModule) {
      const modules =
        type === 'module'
          ? state.get(`editor.currentSandbox.modules`)
          : state.get(`editor.currentSandbox.directories`);

      message.module = modules.find(m => m.shortid === moduleShortid);
    }

    if (type === 'module') {
      message.moduleShortid = moduleShortid;
    } else {
      message.directoryShortid = moduleShortid;
    }

    if (module) {
      live.send(event, message);
    }
  }
}

export function changeUserModule({ props, state }) {
  const userIndex = state
    .get('live.roomInfo.users')
    .findIndex(u => u.id === props.data.live_user_id);

  if (userIndex > -1) {
    state.set(
      `live.roomInfo.users.${userIndex}.currentModuleShortid`,
      props.data.moduleShortid
    );
  }
}

export function sendCloseSession({ live }) {
  live.send('live:close', {});
}

export function sendModuleSaved(context) {
  const { moduleShortid } = context.props;
  sendModuleInfo(context, 'module:saved', 'module', moduleShortid);
}

export function sendModuleCreated(context) {
  const { moduleShortid } = context.props;
  sendModuleInfo(context, 'module:created', 'module', moduleShortid);
}

export function sendMassModuleCreated({ state, live, props }) {
  if (state.get('live.isCurrentEditor')) {
    live.send('module:mass-created', {
      directories: props.directories,
      modules: props.modules,
    });
  }
}

export function sendModuleDeleted(context) {
  sendModuleInfo(
    context,
    'module:deleted',
    'module',
    context.props.moduleShortid,
    { sendModule: false }
  );
}

export function sendModuleUpdated(context) {
  sendModuleInfo(
    context,
    'module:updated',
    'module',
    context.props.moduleShortid
  );
}

export function sendDirectoryCreated(context) {
  const { directoryShortid } = context.props;
  sendModuleInfo(context, 'directory:created', 'directory', directoryShortid);
}

export function sendDirectoryDeleted(context) {
  sendModuleInfo(
    context,
    'directory:deleted',
    'directory',
    context.props.directoryShortid,
    { sendModule: false }
  );
}

export function sendDirectoryUpdated(context) {
  sendModuleInfo(
    context,
    'directory:updated',
    'directory',
    context.props.directoryShortid
  );
}

export function sendChangeCurrentModule({ props, state, live }) {
  const module = state
    .get('editor.currentSandbox.modules')
    .find(m => m.id === props.id);

  const userIndex = state
    .get('live.roomInfo.users')
    .findIndex(u => u.id === state.get('live.liveUserId'));

  if (userIndex > -1) {
    state.set(
      `live.roomInfo.users.${userIndex}.currentModuleShortid`,
      module.shortid
    );

    const followingUserId = state.get('live.followingUserId');

    if (followingUserId) {
      const followingUserIndex = state
        .get('live.roomInfo.users')
        .findIndex(u => u.id === followingUserId);

      if (followingUserIndex > -1) {
        const user = state.get(`live.roomInfo.users.${followingUserIndex}`);

        if (user && user.currentModuleShortid !== module.shortid) {
          // Reset following as this is a user change module action
          state.set('live.followingUserId', null);
        }
      }
    }

    live.send('user:current-module', {
      moduleShortid: module.shortid,
    });
  }
}

export function clearUserSelections({ props, state }) {
  const clearSelections = userId => {
    const userIndex = state
      .get('live.roomInfo.users')
      .findIndex(u => u.id === userId);

    if (userIndex > -1) {
      if (state.get(`live.roomInfo.users.${userIndex}`)) {
        state.set(`live.roomInfo.users.${userIndex}.selection`, null);
        state.push('editor.pendingUserSelections', {
          userId,
          selection: null,
        });
      }
    }
  };

  if (!props.data) {
    // All users

    state.get('live.roomInfo.users').forEach(u => clearSelections(u.id));
  } else {
    clearSelections(props.data.live_user_id);
  }
}

export function consumeModule({ props }) {
  return props.data;
}

export function updateDirectory({ props, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const directoryIndex = sandbox.directories.findIndex(
    directoryEntry => directoryEntry.shortid === props.directoryShortid
  );

  state.set(
    `editor.sandboxes.${sandbox.id}.directories.${directoryIndex}`,
    props.module
  );
}

export function updateModule({ props, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.shortid === props.moduleShortid
  );

  state.merge(
    `editor.sandboxes.${sandbox.id}.modules.${moduleIndex}`,
    props.module
  );
}

export function sendTransform({ ot, props }) {
  if (!props.operation) {
    return {};
  }
  ot.applyClient(props.moduleShortid, props.operation);

  return {};
}

export function receiveTransformation({ ot, props, live }) {
  try {
    ot.applyServer(props.data.module_shortid, props.data.operation);
  } catch (e) {
    // Something went wrong, probably a sync mismatch. Request new version
    console.error('Something went wrong with applying OT operation');
    live.send('live:module_state', {});
  }
}

export function syncModuleState({ live }) {
  live.send('live:module_state', {});
}

export function applyTransformation({ props, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.shortid === props.moduleShortid
  );

  const op = TextOperation.fromJSON(props.operation);

  const code = op.apply(module.code || '');

  return { code };
}

export function setReceivingStatus({ state }) {
  state.set('live.receivingCode', true);
}

export function unSetReceivingStatus({ state }) {
  state.set('live.receivingCode', false);
}

export function acknowledgeOperation({ props, ot }) {
  const { module_shortid: moduleShortid } = props.data;

  ot.serverAck(moduleShortid);
}

export function computePendingOperation({ props, state }) {
  const existingPendingOperation = state.get(
    `editor.pendingOperations.${props.moduleShortid}`
  );

  if (!existingPendingOperation) {
    return { pendingOperation: props.operation };
  }

  const newPendingOperation = TextOperation.fromJSON(existingPendingOperation)
    .compose(TextOperation.fromJSON(props.operation))
    .toJSON();

  return { pendingOperation: newPendingOperation };
}

export function getUserJoinedNotification({ props }) {
  const user = props.data.users.find(u => u.id === props.data.joined_user_id);

  return { message: `${user.username} joined the live session.` };
}

export function getUserLeftNotification({ props, state }) {
  const users = state.get(`live.roomInfo.users`);
  if (users) {
    const user = users.find(u => u.id === props.data.left_user_id);
    if (user) {
      return { message: `${user.username} left the live session.` };
    }
  }

  return { message: 'Someone left the live session' };
}

export function sendMode({ props, live }) {
  live.send('live:mode', {
    mode: props.mode,
  });
}

export function addEditor({ props, live }) {
  live.send('live:add-editor', {
    editor_user_id: props.liveUserId,
  });
}

export function removeEditor({ props, live }) {
  live.send('live:remove-editor', {
    editor_user_id: props.liveUserId,
  });
}

export function removeEditorFromState({ props, state }) {
  const userId = props.liveUserId || props.data.editor_user_id;

  const editors = state.get('live.roomInfo.editorIds');
  const newEditors = editors.filter(id => id !== userId);

  state.set('live.roomInfo.editorIds', newEditors);
}

export function resendOutboundOTTransforms({ ot }) {
  ot.serverReconnect();
}

export function receiveChat({ props, state }) {
  let name = state.get(`live.roomInfo.chat.users.${props.data.live_user_id}`);
  if (!name) {
    const user = state
      .get(`live.roomInfo.users`)
      .find(u => u.id === props.data.live_user_id);

    if (user) {
      state.set(
        `live.roomInfo.chat.users.${props.data.live_user_id}`,
        user.username
      );
      name = user.username;
    } else {
      name = 'Unknown User';
    }
  }

  state.push('live.roomInfo.chat.messages', {
    userId: props.data.live_user_id,
    message: props.data.message,
    date: props.data.date,
  });
}

export function setSandboxOwned({ state }) {
  state.set('editor.currentSandbox.owned', state.get('live.isOwner'));
}

export function sendChat({ live, props }) {
  live.send('chat', {
    message: props.message,
  });
}

export function sendChatEnabled({ live, props }) {
  live.send('live:chat_enabled', { enabled: props.enabled });
}

export function getModuleIdFromShortid({ props, state }) {
  const moduleShortid = props.moduleShortid;
  const modules = state.get('editor.currentSandbox.modules');

  const module = modules.find(m => m.shortid === moduleShortid);

  if (module) {
    return { id: module.id };
  }

  return {};
}

export function getCurrentModuleIdOfUser({ props, state }) {
  const userId = props.liveUserId;

  const userIndex = state
    .get('live.roomInfo.users')
    .findIndex(u => u.id === userId);

  if (userIndex > -1) {
    const user = state.get(`live.roomInfo.users.${userIndex}`);

    if (user) {
      return {
        moduleShortid: user.currentModuleShortid,
      };
    }
  }

  return {};
}

export function getCodeOperation({ props, state }) {
  if (!state.get('live.isLive')) {
    return {};
  }

  const { moduleShortid, code } = props;

  const module = state
    .get('editor.currentSandbox.modules')
    .find(m => m.shortid === moduleShortid);

  if (!module || module.code === code) {
    return {};
  }

  const oldCode = module.code;

  const op = getTextOperation(oldCode, code);

  return {
    operation: op.toJSON(),
  };
}
