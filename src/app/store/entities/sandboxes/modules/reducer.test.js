import { createModule } from 'common/test/mocks';
import reducer from './reducer';
import actions from './actions';

describe('modulesReducer', () => {
  it('can move a module', () => {
    const module = createModule();
    const state = { [module.id]: module };

    const newState = reducer(state, actions.moveModule(module.id, '218hj'));

    expect(newState).toMatchSnapshot();
  });

  it('can rename a module', () => {
    const module = createModule();
    const state = { [module.id]: module };

    const newState = reducer(state, actions.renameModule(module.id, 'ttest2'));

    expect(newState).toMatchSnapshot();
  });

  it('can change the code of a module', () => {
    const module = createModule();
    const state = { [module.id]: module };

    const newState = reducer(state, actions.setCode(module.id, 'koekje'));

    expect(newState).toMatchSnapshot();
  });

  it('can set a module synced', () => {
    const module = createModule();
    const state = { [module.id]: module };

    const newState = reducer(state, actions.setCode(module.id, 'koekje'));
    const finalState = reducer(
      newState,
      actions.setModuleSynced(module.id, true),
    );

    expect(finalState).toMatchSnapshot();
  });
});
