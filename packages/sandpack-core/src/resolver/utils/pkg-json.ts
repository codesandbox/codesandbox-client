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

export function processPackageJSON(
  content: any,
  pkgRoot: string
): ProcessedPackageJSON {
  if (!content || typeof content !== 'object') {
    return { aliases: {}, hasExports: false };
  }

  const aliases: AliasesDict = {};

  // load exports if it's not the root pkg.json
  if (content.exports && pkgRoot !== '/') {
    if (typeof content.exports === 'string') {
      aliases[pkgRoot] = normalizeAliasFilePath(content.exports, pkgRoot);
    } else if (typeof content.exports === 'object') {
      for (const exportKey of Object.keys(content.exports)) {
        const exportValue = extractPathFromExport(
          content.exports[exportKey],
          pkgRoot
        );
        const normalizedKey = normalizeAliasFilePath(exportKey, pkgRoot);
        aliases[normalizedKey] = exportValue || EMPTY_SHIM;
      }
    }

    return { aliases, hasExports: true };
  }

  for (const mainField of MAIN_PKG_FIELDS) {
    if (typeof content[mainField] === 'string') {
      aliases[pkgRoot] = normalizeAliasFilePath(content[mainField], pkgRoot);
      break;
    }
  }

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

  return { aliases, hasExports: false };
}
