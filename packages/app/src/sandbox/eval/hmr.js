// @flow

export default class HMR {
  callback: ?() => void;
  disposeHandler: ?(data: Object) => void;
  data: Object;
  type: ?'accept' | 'decline';
  dirty: boolean = false;

  constructor(type?: 'accept' | 'decline', callback?: Function) {
    this.type = type;
    this.callback = callback;
  }

  callDisposeHandler() {
    if (this.disposeHandler) {
      this.data = {};
      this.disposeHandler(this.data);
    }
  }

  callAcceptCallback() {
    if (this.callback) {
      this.callback();
    }
  }

  setAcceptCallback(callback?: Function) {
    this.callback = callback;
  }

  setDisposeHandler(callback: Function) {
    this.disposeHandler = callback;
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
