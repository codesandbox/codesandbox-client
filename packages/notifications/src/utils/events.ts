export class Emitter<T> {
  private listeners: Set<(message: T) => void> = new Set();

  emit(message: T) {
    this.listeners.forEach(listener => {
      listener(message);
    });
  }

  event = (cb: (message: T) => void) => {
    this.listeners.add(cb);

    return () => {
      this.listeners.delete(cb);
    };
  };
}
