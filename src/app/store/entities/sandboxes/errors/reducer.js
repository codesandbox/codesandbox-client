// @flow
import { CLEAR_ERRORS, ADD_ERROR } from './actions';

const initialState = [];

export default function reducer(
  state: typeof initialState = initialState,
  action: { [key: string]: any, type: string },
) {
  switch (action.type) {
    case CLEAR_ERRORS:
      return initialState;
    case ADD_ERROR:
      return [...state, action.error];
    default:
      return state;
  }
}
