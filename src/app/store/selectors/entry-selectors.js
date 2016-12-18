import { values, sortBy } from 'lodash';

export const entriesInDirectorySelector = (directoryId, sandboxId, entries) => {
  const filteredEntries = values(entries)
    .filter(e => e.directoryId === directoryId && e.sandboxId === sandboxId);

  return sortBy(filteredEntries, e => e.title.toUpperCase());
};
