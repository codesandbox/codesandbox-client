import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { INITIAL_SERVER_STATE } from './state';

export default Module({
  model,
  state: INITIAL_SERVER_STATE,
  signals: {
    restartSandbox: sequences.restartSandbox,
    restartContainer: sequences.restartContainer,
    statusChanged: sequences.setStatus,
    containerStatusChanged: sequences.setContainerStatus,
    onSSEMessage: sequences.onSSEMessage,
    onCodeSandboxAPIMessage: sequences.onCodeSandboxAPIMessage,
    onBrowserFromPortOpened: sequences.openBrowserFromPort,
  },
});
