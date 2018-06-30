import { Module } from 'cerebral';
import model from './model';

import * as sequences from './sequences';
import {
  isCurrentEditor,
  liveUsersByModule,
  isOwner,
  isSourceOfTruth,
} from './getters';
import { isEditor } from './computed';

export default Module({
  model,
  state: {
    isLive: false,
    isTeam: false,
    isLoading: false,
    receivingCode: false,
    reconnecting: false,
    notificationsHidden: false,
    followingUserId: null,
    deviceId: null,
  },
  computed: {
    isEditor,
  },
  getters: {
    isCurrentEditor,
    liveUsersByModule,
    isOwner,
    isSourceOfTruth,
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
    onNavigateAway: sequences.closeSession,
    onToggleNotificationsHidden: sequences.toggleNotificationsHidden,
    onSendChat: sequences.sendChat,
    onChatEnabledChange: sequences.setChatEnabled,
    onFollow: sequences.setFollowing,
  },
});
