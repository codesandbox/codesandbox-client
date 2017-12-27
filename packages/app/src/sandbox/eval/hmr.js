// @flow

export default class HMR {
  callback: ?() => void;
  disposeHandler: ?(data: Object) => void;
  data: Object;
  type: ?'accept' | 'decline';
  dirty: boolean = false;
  selfAccepted: boolean = false;

  callDisposeHandler() {
    if (this.disposeHandler) {
      this.data = {};
      this.disposeHandler(this.data);
      this.disposeHandler = null;
    }
  }

  callAcceptCallback() {
    if (this.callback) {
      this.callback();
    }
  }

  setAcceptCallback(callback?: Function) {
    this.callback = callback;
    this.setSelfAccepted(false);
  }

  setDisposeHandler(callback: Function) {
    this.disposeHandler = callback;
  }

  setSelfAccepted(selfAccepted: boolean) {
    this.selfAccepted = selfAccepted;
    if (selfAccepted) {
      this.data = {};
    }
  }

  setType(type: 'accept' | 'decline') {
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
}
