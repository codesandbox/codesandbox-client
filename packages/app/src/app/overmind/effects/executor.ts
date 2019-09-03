import { Sandbox } from '@codesandbox/common/lib/types';
import { executorsManager } from 'app/utils/executor-manager';

export default {
  initializeExecutor(sandbox: Sandbox) {
    return executorsManager.initializeExecutor(sandbox);
  },
  setupExecutor() {
    return executorsManager.setupExecutor();
  },
  listen(event: string, action: (arg: { event: string; data: any }) => void) {
    const executor = executorsManager.getExecutor();

    if (!executor) {
      throw new Error(
        'Executor is not defined yet, this is an impossible state'
      );
    }

    return executor.on(event, data => {
      action({ event, data: data || {} });
    });
  },
  emit(message: string, data?: any) {
    const executor = executorsManager.getExecutor();

    if (executor) {
      executor.emit(message, data);
    }
  },
  closeExecutor() {
    return executorsManager.closeExecutor();
  },
  updateFiles(sandbox: Sandbox) {
    return executorsManager.updateFiles(sandbox);
  },
  isServer() {
    return executorsManager.isServer();
  },
};
