import * as actions from '../actions/modal';

export type ModalState = {
  show: boolean;
  template: ?string;
  callbacks: {
    confirm: ?() => void,
    close: ?() => void,
  },
  params: Object,
}


const initialState: ModalState = {
  show: false,
  template: undefined,
  callbacks: {
    confirm: undefined,
    close: undefined,
  },
  params: {},
};

export default function handleIndex(state = initialState, action) {
  switch (action.type) {
    case actions.CLOSE_MODAL:
      return {
        ...state,
        show: false,
      };
    case actions.CHANGE_MODAL:
      return {
        ...state,
        template: action.template,
        params: action.params || {},
        callbacks: {
          ...action.callbacks,
        },
        show: true,
      };
    default:
      return state;
  }
}
