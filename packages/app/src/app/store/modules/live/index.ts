import { Module, Computed } from '@cerebral/fluent';
import * as computed from './computed';
import * as sequences from './sequences';
import * as getters from './getters';

import { State } from './types';

const state: State = {
  isLive: false,
  isLoading: false,
  error: null,
  roomInfo: null,
  isOwner: false,
  receivingCode: false,
  reconnecting: false,
  notificationsHidden: false,
  followingUserId: null,
  get isEditor() {
    return getters.isEditor(this);
  },
  isCurrentEditor: Computed(computed.isCurrentEditor),
  liveUsersByModule: Computed(computed.liveUsersByModule),
};

const signals = {
  roomJoined: sequences.initializeLive,
  createLiveClicked: sequences.createLive,
  liveMessageReceived: sequences.handleMessage,
  onTransformMade: sequences.sendTransform,
  applyTransformation: sequences.applyTransformation,
  onCodeReceived: sequences.unSetReceivingStatus,
  onOperationApplied: sequences.clearPendingOperation,
  onSelectionChanged: sequences.sendSelection,
  onSelectionDecorationsApplied: sequences.clearPendingUserSelections,
  onModeChanged: sequences.changeMode,
  onAddEditorClicked: sequences.addEditor,
  onRemoveEditorClicked: sequences.removeEditor,
  onSessionCloseClicked: sequences.closeSession,
  onToggleNotificationsHidden: sequences.toggleNotificationsHidden,
  onSendChat: sequences.sendChat,
  onChatEnabledChange: sequences.setChatEnabled,
  onFollow: sequences.setFollowing,
};

export default Module({
  state,
  signals,
});
