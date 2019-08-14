import { Provider } from 'cerebral';
import { executorsManager } from 'app/utils/executor-manager';

export default Provider({
  initializeExecutor(sandbox) {
    return executorsManager.initializeExecutor(sandbox);
  },
  setupExecutor() {
    return executorsManager.setupExecutor();
  },
  listen(event, signalPath) {
    const signal = this.context.controller.getSignal(signalPath);
    const executor = executorsManager.getExecutor();

    if (!executor) {
      throw new Error(
        'Executor is not defined yet, this is an impossible state'
      );
    }

    return executor.on(event, data => {
      signal({ event, data: data || {} });
    });
  },
  emit(message, data) {
    const executor = executorsManager.getExecutor();

    if (executor) {
      executor.emit(message, data);
    }
  },
  closeExecutor() {
    return executorsManager.closeExecutor();
  },
  updateFiles(sandbox) {
    return executorsManager.updateFiles(sandbox);
  },
  isServer() {
    return executorsManager.isServer();
  },
});
