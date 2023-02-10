import { normalizeAliasFilePath } from './alias';
import { extractPathFromExport } from './exports';
import { EMPTY_SHIM } from './constants';

// alias/exports/main keys, sorted from high to low priority
const MAIN_PKG_FIELDS = ['module', 'browser', 'main', 'jsnext:main'];
const PKG_ALIAS_FIELDS = ['browser', 'alias'];

type AliasesDict = { [key: string]: string };

export interface ProcessedPackageJSON {
  aliases: AliasesDict;
  hasExports: boolean;
}

// See https://webpack.js.org/guides/package-exports/ for a good reference on how this should work
// We aren't completely spec compliant but we're trying to match it as close as possible without nuking performance
export function processPackageJSON(
  content: any,
  pkgRoot: string
): ProcessedPackageJSON {
  if (!content || typeof content !== 'object') {
    return { aliases: {}, hasExports: false };
  }

  const aliases: AliasesDict = {};
  const hasExports = content.exports && pkgRoot !== '/';

  // If there are exports it should have a main field configured
  if (!hasExports) {
    for (const mainField of MAIN_PKG_FIELDS) {
      if (typeof content[mainField] === 'string') {
        aliases[pkgRoot] = normalizeAliasFilePath(content[mainField], pkgRoot);
        break;
      }
    }
  }

  // load exports if it's not the root pkg.json
  if (hasExports) {
    if (typeof content.exports === 'string') {
      aliases[pkgRoot] = normalizeAliasFilePath(content.exports, pkgRoot);
    } else if (typeof content.exports === 'object') {
      const exportKeys = Object.keys(content.exports);
      if (!exportKeys[0].startsWith('.')) {
        const resolvedExport = extractPathFromExport(content.exports, pkgRoot);
        if (!resolvedExport) {
          throw new Error(`Could not find a valid export for ${pkgRoot}`);
        }
        aliases[pkgRoot] = resolvedExport;
      } else {
        for (const exportKey of exportKeys) {
          const exportValue = extractPathFromExport(
            content.exports[exportKey],
            pkgRoot
          );
          const normalizedKey = normalizeAliasFilePath(exportKey, pkgRoot);
          aliases[normalizedKey] = exportValue || EMPTY_SHIM;
        }
      }
    }
  }

  // These aliases should happen as a seperate pass from exports
  // but let's just give it a higher priority for now, we can refactor it later
  if (content.browser === false) {
    aliases[pkgRoot] = EMPTY_SHIM;
  }

  for (const aliasFieldKey of PKG_ALIAS_FIELDS) {
    const aliasField = content[aliasFieldKey];
    if (typeof aliasField === 'object') {
      for (const key of Object.keys(aliasField)) {
        const val = aliasField[key] || EMPTY_SHIM;
        const normalizedKey = normalizeAliasFilePath(key, pkgRoot, false);
        const normalizedValue = normalizeAliasFilePath(val, pkgRoot, false);
        aliases[normalizedKey] = normalizedValue;

        if (aliasFieldKey !== 'browser') {
          aliases[`${normalizedKey}/*`] = `${normalizedValue}/$1`;
        }
      }
    }
  }

  return { aliases, hasExports };
}
