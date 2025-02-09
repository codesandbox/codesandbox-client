type PackageImportArr = Array<PackageImportObj | string>;
type PackageImportType =
  | string
  | null
  | false
  | PackageImportObj
  | PackageImportArr;
type PackageImportObj = {
  [key: string]: string | null | false | PackageImportType;
};

export function extractSpecifierFromImport(
  importValue: PackageImportType,
  pkgRoot: string,
  importKeys: string[]
): string | false {
  if (!importValue) {
    return false;
  }

  if (typeof importValue === 'string') {
    return importValue;
  }

  if (Array.isArray(importValue)) {
    const foundPaths = importValue
      .map(v => extractSpecifierFromImport(v, pkgRoot, importKeys))
      .filter(Boolean);
    if (!foundPaths.length) {
      return false;
    }
    return foundPaths[0];
  }

  if (typeof importValue === 'object') {
    for (const key of importKeys) {
      const importFilename = importValue[key];
      if (importFilename !== undefined) {
        if (typeof importFilename === 'string') {
          return importFilename;
        }
        return extractSpecifierFromImport(importFilename, pkgRoot, importKeys);
      }
    }
    return false;
  }

  throw new Error(`Unsupported imports type ${typeof importValue}`);
}
