export const range = (size: number, startAt: number = 0, skip: number = 1) =>
  [...(Array(size).keys() as any)].map(i => i * skip + startAt);
