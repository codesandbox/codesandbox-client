export default function toDefinition(classes: string[]): string {
  return Object.keys(classes).reduce(
    (previous, className) => previous + `export const ${className}: string;\n`,
    ''
  );
}
