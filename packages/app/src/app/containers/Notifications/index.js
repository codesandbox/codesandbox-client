// @flow
import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { inject, observer } from 'mobx-react';
import { clone } from 'mobx-state-tree';
import { spring, Motion } from 'react-motion';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Portal from 'app/components/Portal';

import type { Notification } from 'common/types';

import NotificationComponent from './Notification';

// eslint-disable-next-line
injectGlobal`
  .notifications-leave {
    opacity: 1;
  }

  .notifications-leave.notifications-leave-active  {
    transition: all 300ms ease;
    opacity: 0.01;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  right: 24px;
  bottom: 0;
  z-index: 41;
`;

class Notifications extends React.PureComponent {
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

    return (
      <Portal>
        <div onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
          <ReactCSSTransitionGroup
            transitionName="notifications"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {notifications.map((originalNotification, index) => {
              const notification = clone(originalNotification);

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
                      <NotificationComponent
                        title={notification.title}
                        type={notification.type}
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

export default inject('signals', 'store')(observer(Notifications));
