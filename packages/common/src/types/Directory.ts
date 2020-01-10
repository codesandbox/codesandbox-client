export type Directory = {
  id: string;
  title: string;
  directoryShortid: string | null;
  shortid: string;
  path: string;
  sourceId: string;
  type: 'directory';
};
