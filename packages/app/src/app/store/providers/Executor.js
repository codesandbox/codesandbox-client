import { Provider } from 'cerebral';
import { executorsManager } from 'app/utils/executor-manager';

export default Provider({
  initializeExecutor(sandbox) {
    return executorsManager.initializeExecutor(sandbox);
  },
  setupExecutor(sandbox) {
    return executorsManager.setupExecutor(sandbox);
  },
  listen(event, signalPath) {
    const signal = this.context.controller.getSignal(signalPath);
    const executor = executorsManager.getExecutor();

    return executor.on(event, data => {
      signal({ event, data: data || {} });
    });
  },
  emit(message, data) {
    const executor = executorsManager.getExecutor();

    return executor.emit(message, data);
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
