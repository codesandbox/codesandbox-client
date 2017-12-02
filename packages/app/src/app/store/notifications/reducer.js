// @flow
import type { Notification } from 'common/types';
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './actions';

type State = Array<Notification>;

const initialState: State = [];

export default function reducer(state: State = initialState, action: Object) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [
        ...state,
        {
          id: action.id,
          title: action.title,
          type: action.notificationType,
          endTime: action.endTime,
          buttons: action.buttons,
        },
      ];
    case REMOVE_NOTIFICATION: {
      const newState = [...state];
      const pos = newState.findIndex(n => n.id === action.id);
      delete newState[pos];
      return newState.filter(x => x);
    }
    default:
      return state;
  }
}
