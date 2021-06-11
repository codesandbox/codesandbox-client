export function errorToObj(err: any): any {
  return {
    message: err.message,
  };
}

export function objToError(err: any): any {
  return new Error(err.message);
}
