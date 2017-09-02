// @flow
import type { Module, Directory } from 'common/types';

// Fields to compare
const MODULE_FIELDS = [
  'directoryShortid',
  'code',
  'title',
  'isNotSynced',
  'isBinary',
];

const DIRECTORY_FIELDS = ['title', 'directoryShortid', 'shortid'];

function checkFields(m1, m2, fields: Array<String>) {
  return fields.some(field => m1[field] !== m2[field]);
}

function compareArrays(m1, m2, fields: Array<String>) {
  return m1.some(first => {
    const second = m2.find(m => m.id === first.id);

    if (!second) {
      return true;
    }

    return checkFields(first, second, MODULE_FIELDS);
  });
}

/**
 * This explicitly checks based on certain fields if the preview should be updated
 *
 * @export
 * @param {any} prevModules
 * @param {any} prevDirectories
 * @param {any} nextModules
 * @param {any} nextDirectories
 */
export default function shouldUpdate(
  prevModules: Array<Module>,
  prevDirectories: Array<Directory>,
  nextModules: Array<Module>,
  nextDirectories: Array<Directory>
) {
  if (prevModules.length !== nextModules.length) return true;
  if (prevDirectories.length !== nextDirectories.length) return true;

  return (
    compareArrays(prevModules, nextModules, MODULE_FIELDS) ||
    compareArrays(prevDirectories, nextDirectories, DIRECTORY_FIELDS)
  );
}
