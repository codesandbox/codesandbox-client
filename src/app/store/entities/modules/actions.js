import createEntityActions from '../../actions/entities';

export const CHANGE_CODE = 'CHANGE_CODE';
export const RENAME_MODULE = 'RENAME_MODULE';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
    renameModule: (id: string, title: string) => (dispatch) => {
      dispatch(({ type: RENAME_MODULE, id, title }));
      entityActions.updateById(id, { title })(dispatch);
    },
  };
  return { ...entityActions, ...customActions };
};
