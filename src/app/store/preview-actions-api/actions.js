// This executes all actions that are requested by the preview

import notifActions from '../notifications/actions';

export default {
  executeAction: action => (dispatch: Function) => {
    switch (action.action) {
      case 'notification': {
        const { title, timeAlive, notificationType } = action;
        return dispatch(
          notifActions.addNotification(title, notificationType, timeAlive),
        );
      }
      default:
        return null;
    }
  },
};
