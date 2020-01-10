import { ModuleCorrection } from './ModuleCorrection';
import { ModuleError } from './ModuleError';

export type Module = {
  id?: string;
  title: string;
  code: string;
  savedCode: string | null;
  shortid: string;
  errors: ModuleError[];
  corrections: ModuleCorrection[];
  directoryShortid: string | null;
  isNotSynced: boolean;
  sourceId: string;
  isBinary: boolean;
  insertedAt: string;
  updatedAt: string;
  path: string;
  now?: any;
  type: 'file';
};
