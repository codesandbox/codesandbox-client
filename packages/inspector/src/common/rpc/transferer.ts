export namespace ObjectsTransferrer {
  export function replacer(key: string | undefined, value: any): any {
    return value;
  }

  export function reviver(key: string | undefined, value: any): any {
    return value;
  }
}
