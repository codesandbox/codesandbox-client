// @flow
import type { Modal } from 'common/types';
import { OPEN_MODAL, CLOSE_MODAL } from './actions';

const initialState: Modal = {
  open: false,
  title: null,
  Body: null,
  width: null,
};

export default function(
  state: Modal = initialState,
  action: { type: string, [key: string]: any },
) {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        open: true,
        title: action.title,
        Body: action.Body,
        width: action.width,
      };
    case CLOSE_MODAL:
      return {
        ...state,
        title: null,
        Body: null,
        width: null,
        open: false,
      };
    default:
      return state;
  }
}
