// @flow
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../actions/notifications';

export type NotificationButton = {
  title: string,
  action: Function,
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  type: 'notice' | 'warning' | 'error';
  number: Date;
  buttons: ?Array<NotificationButton>;
}

type State = Array<Notification>;

const initialState: State = [];

export default function handleIndex(state: State = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [...state, {
        id: action.id,
        title: action.title,
        body: action.body,
        type: action.notificationType,
        endTime: action.endTime,
        buttons: action.buttons,
      }];
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
