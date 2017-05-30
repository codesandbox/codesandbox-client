import { createDirectory } from 'common/test/mocks';
import reducer from './reducer';
import actions from './actions';

describe('directoriesReducer', () => {
  it('can move a directory', () => {
    const directory = createDirectory();
    const state = { [directory.id]: directory };

    const newState = reducer(
      state,
      actions.moveDirectory(directory.id, '218hj'),
    );

    expect(newState).toMatchSnapshot();
  });

  it('can rename a directory', () => {
    const directory = createDirectory();
    const state = { [directory.id]: directory };

    const newState = reducer(
      state,
      actions.renameDirectory(directory.id, 'ttest2'),
    );

    expect(newState).toMatchSnapshot();
  });
});
