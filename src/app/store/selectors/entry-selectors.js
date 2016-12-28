import { values, sortBy } from 'lodash';

export const entriesInDirectorySelector = (directoryId: string, sourceId: string, entries) => {
  const filteredEntries = values(entries)
    .filter(e => e.directoryId === directoryId && e.sourceId === sourceId);

  return sortBy(filteredEntries, e => e.title.toUpperCase());
};
