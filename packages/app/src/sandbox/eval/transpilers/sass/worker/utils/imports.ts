const lineRegex = /@import\s*['|"|`]([^"|'|`]*)['|"|`]/;

export function getImports(code: string): string[] {
  const lines = code.split('\n');
  const result = new Set();
  lines.forEach(line => {
    const match = line.match(lineRegex);
    if (match && match[1]) {
      result.add(match[1]);
    }
  });

  return Array.from(result) as string[];
}
