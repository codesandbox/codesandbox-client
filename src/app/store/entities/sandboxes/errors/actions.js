// @flow

import type { ModuleError } from 'common/types';

export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const ADD_ERROR = 'ADD_ERROR';

export default {
  clearErrors: () => ({ type: CLEAR_ERRORS }),
  addError: (moduleId: string, error: ModuleError) => ({ ADD_ERROR, error }),
};
