import { TextOperation } from 'ot';

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
    .then(res => path.success(res))
    .catch(res => path.error(res));
}

export function listen({ props, live }) {
  live.listen(props.listenSignalPath);
}

export function initializeLiveState({ props, state }) {
  state.set('live.roomInfo', {
    roomId: props.roomId,
    sandboxId: props.sandboxId,
    editorUserId: props.editorUserId,
    users: [],
  });
  state.set('live.isLive', true);
  state.set('live.error', null);
}

export function sendCurrentState({ state, ot, live }) {
  const liveSandboxId = state.get('live.roomInfo.sandboxId');
  const sandbox = state.get(`editor.sandboxes.${liveSandboxId}`);
  const changedModuleShortids = state.get(`editor.changedModuleShortids`);
  const currentModuleShortid = state.get(`editor.currentModuleShortid`);
  const tabs = state.get(`editor.tabs`);

  const otData = ot.getData();

  live.send('state', {
    otData,
    sandbox,
    changedModuleShortids,
    currentModuleShortid,
    tabs,
  });
}

export function consumeState({ props, ot }) {
  const {
    sandbox,
    changedModuleShortids,
    tabs,
    currentModuleShortid,
    otData,
  } = props.data;

  ot.consumeData(otData);

  return {
    sandbox,
    changedModuleShortids,
    tabs,
    currentModuleShortid,
  };
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
