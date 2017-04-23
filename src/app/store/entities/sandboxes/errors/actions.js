// @flow

import type { ModuleError } from 'common/types';

export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const ADD_ERROR = 'ADD_ERROR';

export default {
  clearErrors: (sandboxId: string) => ({ type: CLEAR_ERRORS, id: sandboxId }),
  addError: (sandboxId: string, error: ModuleError) => ({
    type: ADD_ERROR,
    id: sandboxId,
    error,
  }),
};
