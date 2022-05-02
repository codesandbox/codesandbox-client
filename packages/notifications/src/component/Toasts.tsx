import * as React from 'react';
import { useTransition, animated } from 'react-spring';
import { ThemeProvider, Button as ButtonBase } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import Portal from './Portal';
import { NotificationContainer } from './elements';
import {
  NotificationState,
  NotificationMessage,
  NotificationUpdatedEvent,
  NotificationChange,
  NotificationStatus,
} from '../state';
import { Toast, IColors, IButtonType } from './Toast';

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

  if (toast.notification.sticky) {
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

interface Props {
  state: NotificationState;
  colors?: IColors;
  Button?: IButtonType;
}

const DEFAULT_COLORS = {
  [NotificationStatus.ERROR]: '#ED6C6C',
  [NotificationStatus.WARNING]: '#F69935',
  [NotificationStatus.SUCCESS]: '#B3FBB4',
  [NotificationStatus.NOTICE]: codesandboxBlack.colors['button.background'],
};

export function Toasts({
  state,
  colors = DEFAULT_COLORS,
  Button = ButtonBase,
}: Props) {
  const [refMap] = React.useState(
    () => new WeakMap<NotificationToast, HTMLDivElement>()
  );

  const mouseOverRef = React.useRef(false);

  const [notificationsToShow, setNotificationsToShow] = React.useState(
    convertMapToToasts(state.getNotifications())
  );

  const removeNotification = React.useCallback((id: string) => {
    setNotificationsToShow(notifs => {
      const newNotifs = notifs.filter(notif => notif.id !== id);
      const notifToHide = notifs.find(notif => notif.id === id);

      if (newNotifs.length !== notifs.length) {
        return newNotifs;
      }

      if (notifToHide && notifToHide.notification.onHide) {
        notifToHide.notification.onHide();
      }

      return notifs;
    });
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNotificationsToShow(notifs => {
        if (mouseOverRef.current) {
          // Don't remove notifs if there is a mouse there
          return notifs;
        }

        const newNotifs = notifs.filter(
          notif =>
            isSticky(notif) ||
            Date.now() <
              notif.createdAt +
                (notif.notification.timeAlive ||
                  TIME_ALIVE[notif.notification.status])
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

  React.useEffect(() => {
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
  }, [state]);

  React.useEffect(() => {
    const removeListener = state.onNotificationRemoved(event => {
      setNotificationsToShow(notifications =>
        notifications.filter(n => n.id !== event.id)
      );
    });

    return () => {
      removeListener();
    };
  }, [state]);

  const transitions = useTransition<
    NotificationToast,
    { overflow: string; opacity: number; height: number }
  >(notificationsToShow, n => n.id, {
    from: { opacity: 0, height: 0 },
    // @ts-ignore: not typed properly in react-spring
    enter: item => next =>
      next({
        opacity: 1,
        height: refMap.get(item) ? refMap.get(item).offsetHeight + 16 : 0,
      }),
    leave: { opacity: 0, height: 0 },
  });

  return (
    <Portal>
      <ThemeProvider theme={codesandboxBlack}>
        <NotificationContainer
          onMouseEnter={() => {
            mouseOverRef.current = true;
          }}
          onMouseLeave={() => {
            mouseOverRef.current = false;
          }}
        >
          {transitions.map(({ item, props, key }) => (
            <animated.div key={key} style={props}>
              <Toast
                Button={Button}
                colors={colors}
                getRef={ref => ref && refMap.set(item, ref)}
                toast={item}
                removeToast={(id: string) => {
                  removeNotification(id);
                }}
              />
            </animated.div>
          ))}
        </NotificationContainer>
      </ThemeProvider>
    </Portal>
  );
}
