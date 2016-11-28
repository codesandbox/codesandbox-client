import createEntityActions from '../../actions/entities';

export const CHANGE_CODE = 'CHANGE_CODE';

export default (schema) => {
  const entityActions = createEntityActions(schema);
  const customActions = {
    changeCode: (id: string, code: string) => ({ type: CHANGE_CODE, id, code }),
  };
  return { ...entityActions, ...customActions };
};
