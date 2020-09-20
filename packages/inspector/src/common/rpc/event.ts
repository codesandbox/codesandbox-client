import { IDisposable, Disposable } from './disposable';

/**
 * A typed event.
 */
export interface Event<T> {
  /**
   *
   * @param listener The listener function will be called when the event happens.
   * @return a disposable to remove the listener again.
   */
  (listener: (e: T) => any): IDisposable;
}

export class Emitter<T> {
  private registeredListeners = new Set<(e: T) => void>();
  private _event: Event<T> | undefined;

  get event(): Event<T> {
    if (!this._event) {
      this._event = (listener: (e: T) => void) => {
        this.registeredListeners.add(listener);

        return Disposable.create(() => {
          this.registeredListeners.delete(listener);
        });
      };
    }

    return this._event;
  }

  fire(event: T) {
    this.registeredListeners.forEach((listener) => {
      listener(event);
    });
  }
}
