import reducer from './reducer';
import { ADD_ERROR, CLEAR_ERRORS } from './actions';

describe('errorsReducer', () => {
  test('addError', () => {
    const newState = reducer([], { type: ADD_ERROR, error: { test: 'test' } });
    expect(newState).toEqual([{ test: 'test' }]);
  });

  test('clearErrors', () => {
    const newState = reducer([{ test: 'test' }], { type: CLEAR_ERRORS });
    expect(newState).toEqual([]);
  });
});
