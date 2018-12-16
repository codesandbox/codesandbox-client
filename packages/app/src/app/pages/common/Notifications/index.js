import * as React from 'react';

import { inject, observer } from 'mobx-react';
import { Transition } from 'react-spring';
import Portal from 'common/components/Portal';

import Notification from './Notification';

import { NotificationContainer, GlobalStyle } from './elements';

class Notifications extends React.Component {
  constructor() {
    super();

    this.state = {
      hovering: false,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      // Only if user is not hovering
      if (!this.state.hovering) {
        const date = Date.now();
        requestAnimationFrame(() => {
          this.props.store.notifications.forEach(n => {
            // Delete notification if time is up
            if (n.endTime < date) {
              this.closeNotification(n.id);
            }
          });
        });
      }
    }, 3000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  closeNotification = id => {
    this.props.signals.notificationRemoved({ id });
  };

  hoverOn = () => {
    this.setState({ hovering: true });
  };

  hoverOff = () => {
    this.setState({ hovering: false });
  };

  interval: number;

  render() {
    const notifications = this.props.store.notifications;
    if (notifications.length === 0) {
      return null;
    }

    return (
      <Portal>
        <div onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
          <GlobalStyle />
          <Transition
            items={notifications.map((notif, i) => ({ ...notif, i }))}
            keys={notif => notif.id}
            from={{ bottom: -150, opacity: 1 }}
            enter={item => ({
              bottom: 24 + 60 * (notifications.length - 1 - item.i),
              opacity: 1,
            })}
            update={item => ({
              bottom: 24 + 60 * (notifications.length - 1 - item.i),
              opacity: 1,
            })}
            leave={item => ({
              bottom: 24 + 60 * (notifications.length - 1 - item.i),
              opacity: 0,
            })}
          >
            {notification => styles => (
              <NotificationContainer key={notification.id} style={styles}>
                <Notification
                  title={notification.title}
                  type={notification.notificationType}
                  buttons={notification.buttons}
                  close={() => this.closeNotification(notification.id)}
                />
              </NotificationContainer>
            )}
          </Transition>
        </div>
      </Portal>
    );
  }
}

export default inject('signals', 'store')(observer(Notifications));
