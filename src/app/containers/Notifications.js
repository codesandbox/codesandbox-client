// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import styled, { injectGlobal } from 'styled-components';
import { connect } from 'react-redux';
import { spring, Motion } from 'react-motion';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import type { Notification } from '../store/reducers/notifications';
import notificationActionCreators from '../store/actions/notifications';
import NotificationComponent from '../components/Notification';
import Portal from '../components/Portal';

type Props = {
  notifications: Array<Notification>;
  notificationActions: typeof notificationActionCreators;
};

type State = {
  hovering: boolean;
};

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
  left: 24px;
  bottom: 0;
  zIndex: 20;
`;

const mapStateToProps = state => ({
  notifications: state.notifications,
});
const mapDispatchToProps = dispatch => ({
  notificationActions: bindActionCreators(notificationActionCreators, dispatch),
});
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
          this.props.notifications.forEach((n) => {
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

  closeNotification = (id) => {
    this.props.notificationActions.removeNotification(id);
  }

  hoverOn = () => {
    this.setState({ hovering: true });
  };

  hoverOff = () => {
    this.setState({ hovering: false });
  };

  interval: number;
  props: Props;
  state: State;

  render() {
    const { notifications } = this.props;
    return (
      <Portal>
        <div onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
          <ReactCSSTransitionGroup
            transitionName="notifications"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {notifications.map((n: Notification, i: number) => (
              <Motion
                key={n.id}
                defaultStyle={{ y: -150 }}
                style={{ y: spring(24 + (140 * (notifications.length - 1 - i))) }}
              >
                {({ y }) => (
                  <NotificationContainer key={n.id} style={{ bottom: y }}>
                    <NotificationComponent
                      title={n.title}
                      body={n.body}
                      type={n.type}
                      buttons={n.buttons}
                      close={() => this.closeNotification(n.id)}
                    />
                  </NotificationContainer>
                )}
              </Motion>
            ))}
          </ReactCSSTransitionGroup>
        </div>
      </Portal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
