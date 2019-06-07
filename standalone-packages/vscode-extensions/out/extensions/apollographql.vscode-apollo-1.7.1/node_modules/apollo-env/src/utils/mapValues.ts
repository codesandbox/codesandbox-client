export function mapValues<T, U = T>(
  object: Record<string, T>,
  callback: (value: T) => U
): Record<string, U> {
  const result: Record<string, U> = Object.create(null);

  for (const [key, value] of Object.entries(object)) {
    result[key] = callback(value);
  }

  return result;
}
