// @flow

type State = {
  integrations: boolean,
};

const initialState = {
  integrations: false,
};

export default function reducer(
  state: State = initialState,
  action: Object
): State {
  switch (action.type) {
    case 'ENABLE_INTEGRATIONS':
      return {
        ...state,
        integrations: true,
      };
    default:
      return state;
  }
}
