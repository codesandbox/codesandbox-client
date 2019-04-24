import * as React from 'react';

import Portal from '@codesandbox/common/lib/components/Portal';

import { NotificationContainer } from './elements';
import {
  NotificationState,
  NotificationMessage,
  NotificationUpdatedEvent,
  NotificationChange,
  NotificationStatus,
} from '../state';
import { Toast } from './Toast';

export interface NotificationToast {
  id: string;
  createdAt: number;
  notification: NotificationMessage;
}

const convertMapToToasts = (
  notifications: Map<string, NotificationMessage>
): NotificationToast[] =>
  Array.from(notifications.keys()).map(id => ({
    id,
    createdAt: Date.now(),
    notification: notifications.get(id),
  }));

const convertNotificationEventToToast = (
  notificationEvent: NotificationUpdatedEvent
): NotificationToast => ({
  id: notificationEvent.id,
  createdAt: Date.now(),
  notification: notificationEvent.notification,
});

const isSticky = (toast: NotificationToast) => {
  if (
    toast.notification.status === NotificationStatus.ERROR &&
    toast.notification.actions
  ) {
    return true;
  }

  return false;
};

const TIME_ALIVE = {
  [NotificationStatus.SUCCESS]: 7000,
  [NotificationStatus.NOTICE]: 10000,
  [NotificationStatus.WARNING]: 12000,
  [NotificationStatus.ERROR]: 20000,
};

export function Toasts({ state }: { state: NotificationState }) {
  const [notificationsToShow, setNotificationsToShow] = React.useState(
    convertMapToToasts(state.getNotifications())
  );

  const removeNotification = React.useCallback((id: string) => {
    setNotificationsToShow(notifs => {
      const newNotifs = notifs.filter(notif => notif.id !== id);

      if (newNotifs.length !== notifs.length) {
        return newNotifs;
      }

      return notifs;
    });
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNotificationsToShow(notifs => {
        const newNotifs = notifs.filter(
          notif =>
            isSticky(notif) ||
            Date.now() < notif.createdAt + TIME_ALIVE[notif.notification.status]
        );

        if (newNotifs.length !== notifs.length) {
          return newNotifs;
        }

        return notifs;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(
    () => {
      const addListener = state.onNotificationUpdated(event => {
        if (event.type === NotificationChange.ADD) {
          setNotificationsToShow(notifications => [
            ...notifications,
            convertNotificationEventToToast(event),
          ]);
        }
      });

      return () => {
        addListener();
      };
    },
    [state]
  );

  return (
    <Portal>
      <NotificationContainer>
        {notificationsToShow.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            removeToast={(id: string) => {
              removeNotification(id);
            }}
          />
        ))}
      </NotificationContainer>
    </Portal>
  );
}
