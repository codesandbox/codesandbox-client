// @flow
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from './actions';

export type NotificationButton = {
  title: string,
  action: Function,
};

export type Notification = {
  id: number,
  title: string,
  type: 'notice' | 'success' | 'warning' | 'error',
  number: Date,
  buttons: ?Array<NotificationButton>,
};

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
