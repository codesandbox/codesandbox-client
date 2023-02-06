import { normalizeAliasFilePath } from './alias';

// List of allowed condition keys in pkg#exports field
const ALLOWED_CONDITIONS = new Set([
  'browser',
  'development',
  'default',
  'require',
  'import',
]);

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
    for (const [key, value] of Object.entries(exportValue)) {
      if (ALLOWED_CONDITIONS.has(key)) {
        if (typeof value === 'string') {
          return normalizePackageExport(value, pkgRoot);
        }
        return extractPathFromExport(value, pkgRoot);
      }
    }
    return false;
  }

  throw new Error(`Unsupported export type ${typeof exportValue}`);
}
