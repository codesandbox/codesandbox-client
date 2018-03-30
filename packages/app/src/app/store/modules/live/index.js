import { Module, Computed } from '@cerebral/fluent';
import * as computed from './computed';
import * as sequences from './sequences';

export default Module({
  state: {
    isLive: false,
    isLoading: false,
    isOwner: false,
    receivingCode: false,
    reconnecting: false,
    notificationsHidden: false,
    followingUserId: null,
    isEditor: Computed(computed.isEditor),
    isCurrentEditor: Computed(computed.isCurrentEditor),
    liveUsersByModule: Computed(computed.liveUsersByModule),
  },
  signals: {
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
  },
});
