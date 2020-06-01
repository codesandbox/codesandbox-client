const importRegex = /import\s*\(/g;

export function convertDynamicImport(code: string) {
  return code.replace(importRegex, '$csbImport(');
}
