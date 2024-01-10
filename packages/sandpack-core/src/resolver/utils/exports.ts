import { normalizeAliasFilePath } from './alias';

// exports keys, sorted from high to low priority
const EXPORTS_KEYS = ['browser', 'development', 'default', 'require', 'import'];

type PackageExportType =
  | string
  | null
  | false
  | PackageExportObj
  | PackageExportArr;

type PackageExportArr = Array<PackageExportObj | string>;

type PackageExportObj = {
  [key: string]: string | null | false | PackageExportType;
};

export function normalizePackageExport(
  filepath: string,
  pkgRoot: string
): string {
  return normalizeAliasFilePath(filepath.replace(/\*/g, '$1'), pkgRoot);
}

export function extractPathFromExport(
  exportValue: PackageExportType,
  pkgRoot: string
): string | false {
  if (!exportValue) {
    return false;
  }

  if (typeof exportValue === 'string') {
    return normalizePackageExport(exportValue, pkgRoot);
  }

  if (Array.isArray(exportValue)) {
    const foundPaths = exportValue
      .map(v => extractPathFromExport(v, pkgRoot))
      .filter(Boolean);
    if (!foundPaths.length) {
      return false;
    }
    return foundPaths[0];
  }

  if (typeof exportValue === 'object') {
    for (const key of EXPORTS_KEYS) {
      const exportFilename = exportValue[key];
      if (exportFilename !== undefined) {
        if (typeof exportFilename === 'string') {
          return normalizePackageExport(exportFilename, pkgRoot);
        }
        return extractPathFromExport(exportFilename, pkgRoot);
      }
    }
    return false;
  }

  throw new Error(`Unsupported export type ${typeof exportValue}`);
}
