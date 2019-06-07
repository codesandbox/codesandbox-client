export function invariant(condition: any, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}
