import * as React from 'react';

import { connect } from 'app/fluent'
import { spring, Motion } from 'react-motion';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Portal from 'app/components/Portal';

import Notification from './Notification';

import { NotificationContainer } from './elements';

type State = {
  hovering: boolean
}

export default connect()
  .with(({ state, signals }) => ({
    notifications: state.notifications,
    notificationRemoved: signals.notificationRemoved
  }))
  .toClass(props =>
    class Notifications extends React.Component<typeof props, State> {
      interval: NodeJS.Timer
      state: State = {
        hovering: false
      }
      componentDidMount() {
        this.interval = setInterval(() => {
          // Only if user is not hovering
          if (!this.state.hovering) {
            const date = Date.now();
            requestAnimationFrame(() => {
              this.props.notifications.forEach(n => {
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
        this.props.notificationRemoved({ id });
      };

      hoverOn = () => {
        this.setState({ hovering: true });
      };

      hoverOff = () => {
        this.setState({ hovering: false });
      };

      render() {
        const notifications = this.props.notifications;

        return (
          <Portal>
            <div onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
              <ReactCSSTransitionGroup
                transitionName="notifications"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
              >
                {notifications.map((originalNotification, index) => {
                  const notification = originalNotification;

                  return (
                    <Motion
                      key={notification.id}
                      defaultStyle={{ y: -150 }}
                      style={{
                        y: spring(24 + 60 * (notifications.length - 1 - index)),
                      }}
                    >
                      {({ y }) => (
                        <NotificationContainer
                          key={notification.id}
                          style={{ bottom: y }}
                        >
                          <Notification
                            title={notification.title}
                            type={notification.notificationType}
                            buttons={notification.buttons}
                            close={() => this.closeNotification(notification.id)}
                          />
                        </NotificationContainer>
                      )}
                    </Motion>
                  );
                })}
              </ReactCSSTransitionGroup>
            </div>
          </Portal>
        );
      }
    }
  )
