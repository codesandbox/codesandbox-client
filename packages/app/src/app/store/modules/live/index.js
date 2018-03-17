import { Module } from 'cerebral';
import model from './model';

import * as sequences from './sequences';
import { isCurrentEditor } from './getters';

export default Module({
  model,
  state: {
    isLive: false,
    isLoading: false,
    isOwner: false,
    receivingCode: false,
  },
  getters: {
    isCurrentEditor,
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
  },
});
