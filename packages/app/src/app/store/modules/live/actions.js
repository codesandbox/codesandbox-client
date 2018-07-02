import { TextOperation } from 'ot';
import { camelizeKeys } from 'humps';

import VERSION from 'common/version';

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

export function initializeLiveState({ props, state }) {
  state.set('live.roomInfo', {
    connectionCount: 1,
    roomId: props.roomId,
    ownerIds: props.ownerIds,
    sandboxId: props.sandboxId,
    editorIds: props.editorIds,
    sourceOfTruthDeviceId: props.sourceOfTruthDeviceId,
    mode: props.mode,
    chatEnabled: props.chatEnabled,
    usersMetadata: {},
    users: [],
    startTime: Date.now(),
    chat: {
      messages: [],
      users: {},
    },
    version: VERSION,
  });
  state.set('live.deviceId', props.deviceId);
  state.set('live.isLive', true);
  state.set('live.error', null);
}

let colorIndex = 0;
const COLORS = [
  [230, 103, 103], // rgb(230, 103, 103)
  [84, 109, 229], // rgb(84, 109, 229)
  [106, 176, 76], // rgb(106, 176, 76)
  [241, 144, 102], // rgb(241, 144, 102)
  [245, 205, 121], // rgb(245, 205, 121)
  [48, 51, 107], // rgb(48, 51, 107)
  [196, 69, 105], // rgb(196, 69, 105)
  [247, 143, 179], // rgb(247, 143, 179)
  [225, 95, 65], // rgb(225, 95, 65)
  [87, 75, 144], // rgb(87, 75, 144)
  [255, 56, 56], // rgb(255, 56, 56)
  [197, 108, 240], // rgb(197, 108, 240)
  [6, 82, 221], // rgb(6, 82, 221)
  [164, 74, 63], // rgb(164, 74, 63)
];

export function addUserMetadata({ props, state }) {
  const usersMetadata = state.get('live.roomInfo.usersMetadata');
  const users = props.users;

  users.forEach(user => {
    if (!usersMetadata.get(user.id)) {
      state.set(`live.roomInfo.usersMetadata.${user.id}`, {
        color: COLORS[colorIndex++ % COLORS.length],
        selection: null,
        currentModuleShortid: state.get('editor.currentModuleShortid'),
      });
    }
  });
}

export function sendCurrentState({ state, ot, live }) {
  const liveSandboxId = state.get('live.roomInfo.sandboxId');
  const sandbox = state.get(`editor.sandboxes.${liveSandboxId}`);
  const changedModuleShortids = state.get(`editor.changedModuleShortids`);
  const currentModuleShortid = state.get(`editor.currentModuleShortid`);
  const tabs = state.get(`editor.tabs`);
  const roomInfo = state.get(`live.roomInfo`);

  const otData = ot.getData();

  live.send('state', {
    otData,
    sandbox,
    changedModuleShortids,
    currentModuleShortid,
    tabs,
    roomInfo,
  });
}

export function consumeState({ props }) {
  const {
    sandbox,
    changedModuleShortids,
    tabs,
    currentModuleShortid,
    otData,
    roomInfo,
  } = props.data;

  return {
    sandbox,
    changedModuleShortids,
    tabs,
    currentModuleShortid,
    roomInfo,
    otData,
  };
}

export function consumeOTData({ props, ot }) {
  ot.consumeData(props.otData);
}

export function sendSelection({ props, state, live }) {
  const userId = state.get('user.id');
  const moduleShortid = props.moduleShortid;
  const selection = props.selection;

  state.set(
    `live.roomInfo.usersMetadata.${userId}.currentModuleShortid`,
    moduleShortid
  );
  state.set(`live.roomInfo.usersMetadata.${userId}.selection`, selection);

  live.send('user:selection', {
    userId,
    moduleShortid,
    selection,
  });
}

export function consumeUserState({ props }) {
  const users = camelizeKeys(props.data.users);

  return { users };
}

export function updateSelection({ props, state }) {
  const userId = props.data.userId;
  const moduleShortid = props.data.moduleShortid;
  const selection = props.data.selection;

  state.set(
    `live.roomInfo.usersMetadata.${userId}.currentModuleShortid`,
    moduleShortid
  );
  state.set(`live.roomInfo.usersMetadata.${userId}.selection`, selection);

  return {
    userId,
    moduleShortid,
    selection,
  };
}

export function getSelectionsForCurrentModule({ state }) {
  const selections = [];
  const moduleShortid = state.get('editor.currentModuleShortid');

  state.get('live.roomInfo.usersMetadata').forEach((user, userId) => {
    if (
      userId === state.get('user.id') ||
      user.currentModuleShortid !== moduleShortid ||
      !state.get('live.isEditor')(userId)
    ) {
      return;
    }

    const userInfo = state
      .get(`live.roomInfo.users`)
      .find(u => u.id === userId);

    if (user.selection) {
      selections.push({
        userId,
        color: user.color.toJS(),
        name: userInfo.username,
        selection: user.selection.toJSON(),
      });
    }
  });

  return { selections };
}

export function sendSelectionToEditor({ props, state }) {
  const userId = props.userId;
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
      color: state.get(`live.roomInfo.usersMetadata.${userId}.color`).toJS(),
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

export function sendModuleSaved(context) {
  const { moduleShortid } = context.props;
  sendModuleInfo(context, 'module:saved', 'module', moduleShortid);
}

export function sendModuleCreated(context) {
  const { moduleShortid } = context.props;
  sendModuleInfo(context, 'module:created', 'module', moduleShortid);
}

export function sendMassModuleCreated({ live, props }) {
  live.send('module:mass-created', {
    directories: props.directories,
    modules: props.modules,
  });
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

  state.set(
    `live.roomInfo.usersMetadata.${state.get('user.id')}.currentModuleShortid`,
    module.shortid
  );

  const followingUserId = state.get('live.followingUserId');
  if (followingUserId) {
    const user = state.get('live.roomInfo.usersMetadata').get(followingUserId);

    if (user && user.currentModuleShortid !== module.shortid) {
      // Reset following as this is a user change module action
      state.set('live.followingUserId', null);
    }
  }

  live.send('user:current-module', {
    moduleShortid: module.shortid,
  });
}

export function clearUserSelections({ props, state }) {
  if (state.get(`live.roomInfo.usersMetadata.${props.data.user_id}`)) {
    state.set(
      `live.roomInfo.usersMetadata.${props.data.user_id}.selection`,
      null
    );
    state.push('editor.pendingUserSelections', {
      userId: props.data.user_id,
      selection: null,
    });
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
  ot.applyClient(props.moduleShortid, props.operation);
}

export function receiveTransformation({ ot, props }) {
  ot.applyServer(props.data.module_shortid, props.data.operation);
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
  const existingPendingOperation = state.get('editor.pendingOperation');

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
    editor_user_id: props.userId,
  });
}

export function removeEditor({ props, live }) {
  live.send('live:remove-editor', {
    editor_user_id: props.userId,
  });
}

export function removeEditorFromState({ props, state }) {
  const userId = props.userId || props.data.editor_user_id;

  const editors = state.get('live.roomInfo.editorIds');
  const newEditors = editors.filter(id => id !== userId);

  state.set('live.roomInfo.editorIds', newEditors);
}

export function resendOutboundOTTransforms({ ot }) {
  ot.serverReconnect();
}

export function receiveChat({ props, state }) {
  let name = state.get(`live.roomInfo.chat.users.${props.data.user_id}`);
  if (!name) {
    const user = state
      .get(`live.roomInfo.users`)
      .find(u => u.id === props.data.user_id);

    if (user) {
      state.set(
        `live.roomInfo.chat.users.${props.data.user_id}`,
        user.username
      );
      name = user.username;
    } else {
      name = 'Unknown User';
    }
  }

  state.push('live.roomInfo.chat.messages', {
    userId: props.data.user_id,
    message: props.data.message,
    date: props.data.date,
  });
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
  const userId = props.userId;
  const usersMetadata = state.get('live.roomInfo.usersMetadata');

  const user = usersMetadata.get(userId);

  if (user) {
    return {
      moduleShortid: user.currentModuleShortid,
    };
  }

  return {};
}

export function getCodeOperation({ props }) {
  const { oldCode, code } = props;

  const op = new TextOperation();

  op.delete(oldCode.length);
  op.insert(code);

  return {
    operation: op.toJSON(),
  };
}
