export default class HMR {
  callback?: () => void;
  disposeHandler?: (data: Object) => void;
  data: Object = {};
  type?: 'accept' | 'decline';
  dirty: boolean = false;
  selfAccepted: boolean = false;
  invalidated = false;

  callDisposeHandler() {
    if (this.disposeHandler) {
      this.data = {};
      this.disposeHandler(this.data);
      this.disposeHandler = undefined;
    }
  }

  callAcceptCallback() {
    if (this.callback) {
      this.callback();
    }
  }

  setAcceptCallback(callback?: () => void) {
    this.callback = callback;
    this.setSelfAccepted(false);
  }

  setDisposeHandler(callback: () => void) {
    this.disposeHandler = callback;
  }

  setSelfAccepted(selfAccepted: boolean) {
    this.selfAccepted = selfAccepted;
    if (selfAccepted) {
      this.data = {};
    }
  }

  setType(type: 'accept' | 'decline' | undefined) {
    this.type = type;
  }

  setDirty(dirty: boolean) {
    this.dirty = dirty;
  }

  isDirty() {
    return this.dirty;
  }

  /**
   * Returns whether this module should reset the compilation of its parents
   */
  isHot() {
    return this.type === 'accept';
  }

  isDeclined(isEntry: boolean) {
    if (this.type === 'decline') {
      return true;
    }

    return !this.isHot() && isEntry;
  }

  /**
   * Setting the module to invalidated means that we MUST evaluate it again, which means
   * that we throw away its compilation and hmrConfig, and we're going to force a second evaluation
   * once this has been run.
   */
  setInvalidated(invalidated: boolean) {
    this.invalidated = invalidated;
  }
}
