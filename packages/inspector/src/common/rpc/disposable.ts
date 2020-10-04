import { Emitter } from './event';

export interface IDisposable {
  /**
   * Dispose this object.
   */
  dispose(): void;
}

export class Disposable implements IDisposable {
  private onWillDisposeEmitter = new Emitter<void>();
  public onWillDispose = this.onWillDisposeEmitter.event;

  protected toDispose: IDisposable[] = [];
  public isDisposed = false;

  public dispose() {
    this.onWillDisposeEmitter.fire();
    this.isDisposed = true;
    this.toDispose.forEach(disposable => {
      disposable.dispose();
    });
  }

  public static is(arg: any): arg is Disposable {
    return typeof arg['dispose'] === 'function';
  }

  public static create(cb: () => void): IDisposable {
    return {
      dispose: cb,
    };
  }
}
