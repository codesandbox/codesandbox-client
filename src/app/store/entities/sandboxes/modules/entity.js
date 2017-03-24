// @flow
import { schema } from 'normalizr';

export type Module = {
  id: string,
  title: string,
  code: ?string,
  shortid: string,
  directoryShortid: ?string,
  isNotSynced: boolean,
  error: ?{
    message: string,
    line: number,
    column: number,
    title: string,
    moduleId: ?string,
    severity: 'error' | 'warning',
    type: 'compile' | 'dependency-not-found' | 'no-dom-change',
    payload: Object,
  },
};

export default new schema.Entity('modules');
