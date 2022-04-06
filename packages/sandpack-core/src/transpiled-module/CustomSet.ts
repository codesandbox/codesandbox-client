// This is a hack to work around some polyfills
export class CustomSet<T> {
  private internalSet: Set<T>;

  constructor() {
    this.internalSet = new Set();
  }

  size(): number {
    return this.internalSet.size;
  }

  clear() {
    this.internalSet.clear();
  }

  add(val: T): void {
    this.internalSet.add(val);
  }

  delete(val: T): void {
    this.internalSet.delete(val);
  }

  values(): Array<T> {
    const result = [];
    for (const val of this.internalSet) {
      result.push(val);
    }
    return result;
  }
}
