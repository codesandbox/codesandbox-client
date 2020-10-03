export interface IDisposable {
  /**
   * Dispose this object.
   */
  dispose(): void;
}

export class Disposable implements IDisposable {
  protected toDispose: IDisposable[] = [];
  public isDisposed = false;

  public dispose() {
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
