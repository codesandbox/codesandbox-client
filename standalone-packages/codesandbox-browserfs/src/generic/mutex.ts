import setImmediate from '../generic/setImmediate';

/**
 * Нерекурсивный мьютекс
 * @hidden
 */
export default class Mutex {
  private _locked: boolean = false;
  private _waiters: Function[] = [];

  public lock(cb: Function): void {
    if (this._locked) {
      this._waiters.push(cb);
      return;
    }
    this._locked = true;
    cb();
  }

  public unlock(): void {
    if (!this._locked) {
      throw new Error('разблокировка неблокированного мьютекса');
    }

    const next = this._waiters.shift();
    // не разблокировать - мы хотим встать в очередь на _end_ выполнения текущей задачи, но мы не хотим, 
    // чтобы вызывалась встроенная функция независимо от текущего стека.  
    // Таким образом, мы по-прежнему получаем приятное поведение: разблокировка, сразу за которой следует блокировка, не вызовет голодания.
    if (next) {
      setImmediate(next);
      return;
    }

    this._locked = false;
  }

  public tryLock(): boolean {
    if (this._locked) {
      return false;
    }

    this._locked = true;
    return true;
  }

  public isLocked(): boolean {
    return this._locked;
  }
}
