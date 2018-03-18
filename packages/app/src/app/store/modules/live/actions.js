import { TextOperation } from 'ot';
import { camelizeKeys } from 'humps';

export function createRoom({ api, props }) {
  const id = props.sandboxId;

  return api
    .post(`/sandboxes/${id}/live`, {
      id,
    })
    .then(({ id: roomId }) => ({ roomId }));
}

export function connect({ live }) {
  return live.connect();
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
    roomId: props.roomId,
    sandboxId: props.sandboxId,
    editorUserId: props.editorUserId,
    usersMetadata: {},
    users: [],
  });
  state.set('live.isLive', true);
  state.set('live.error', null);
}

const COLORS = [
  [230, 103, 103],
  [84, 109, 229],
  [241, 144, 102],
  [61, 193, 211],
  [245, 205, 121],
  [196, 69, 105],
  [247, 143, 179],
  [61, 193, 211],
];

export function addUserMetadata({ props, state }) {
  const usersMetadata = state.get('live.roomInfo.usersMetadata');
  const users = props.users;

  users.forEach((user, i) => {
    if (!usersMetadata.get(user.id)) {
      state.set(`live.roomInfo.usersMetadata.${user.id}`, {
        color: COLORS[i % (COLORS.length - 1)],
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

export function consumeState({ props, ot }) {
  const {
    sandbox,
    changedModuleShortids,
    tabs,
    currentModuleShortid,
    otData,
    roomInfo,
  } = props.data;

  ot.consumeData(otData);

  return {
    sandbox,
    changedModuleShortids,
    tabs,
    currentModuleShortid,
    roomInfo,
  };
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

export function consumeUserEnteredState({ props }) {
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
      user.currentModuleShortid !== moduleShortid
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
    userId !== state.get('user.id')
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

  live.send('user:current-module', {
    moduleShortid: module.shortid,
  });
}

export function clearUserSelections({ props, state }) {
  state.set(
    `live.roomInfo.usersMetadata.${props.data.user_id}.selection`,
    null
  );
  state.push('editor.pendingUserSelections', {
    userId: props.data.user_id,
    selection: null,
  });
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

  state.set(
    `editor.sandboxes.${sandbox.id}.modules.${moduleIndex}`,
    props.module
  );
}

export function sendTransform({ ot, props }) {
  ot.applyClient(props.moduleShortid, props.operation);
}

export function receiveTransformation({ ot, props }) {
  ot.applyServer(props.data.moduleShortid, props.data.operation);
}

export function applyTransformation({ props, state }) {
  const sandbox = state.get('editor.currentSandbox');
  const module = sandbox.modules.find(
    moduleEntry => moduleEntry.shortid === props.moduleShortid
  );

  const op = TextOperation.fromJSON(props.operation);

  const code = op.apply(module.code);

  return { code };
}

export function setReceivingStatus({ state }) {
  state.set('live.receivingCode', true);
}

export function unSetReceivingStatus({ state }) {
  state.set('live.receivingCode', false);
}

export function acknowledgeOperation({ props, ot }) {
  const { moduleShortid } = props.data;

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
