import React from 'react';
import { observer } from 'mobx-react';

import { Transition, animated, config } from 'react-spring';
import track from 'common/utils/analytics';

class OverlayComponent extends React.Component {
  state = {
    isOpen: this.props.isOpen === undefined ? false : this.props.isOpen,
    controlled: this.props.isOpen !== undefined,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.listenForClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.listenForClick);
    this.unmounted = true;
  }

  isOpen = () => {
    const { isOpen: isOpenProps } = this.props;
    const { isOpen: isOpenState, controlled } = this.state;

    return controlled ? isOpenProps : isOpenState;
  };

  listenForClick = (e: MouseEvent) => {
    if (!e.defaultPrevented && this.isOpen()) {
      if (!this.unmounted) {
        if (this.props.event) {
          track(`Closed ${this.props.event}`);
        }
        if (this.state.controlled) {
          if (this.props.onClose) {
            this.props.onClose();
          }
        } else {
          this.setState({ isOpen: false });
        }
      }
    }
  };

  open = () => {
    if (!this.unmounted) {
      if (this.props.event) {
        track(`Opened ${this.props.event}`);
      }
      if (this.state.controlled) {
        if (this.props.onOpen) {
          this.props.onOpen();
        }
      } else {
        this.setState({ isOpen: true });
      }
    }
  };

  render() {
    const { children, Overlay, noHeightAnimation } = this.props;

    const isOpen = this.isOpen();

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        style={{ position: 'relative' }}
        onMouseDown={e => e.preventDefault()}
      >
        {children(this.open)}
        <Transition
          items={isOpen}
          from={{
            height: noHeightAnimation ? undefined : 0,
            opacity: 0.6,
            position: 'absolute',
            top: 'calc(100% + 1rem)',
            right: 0,
            zIndex: 10,
            overflow: 'hidden',
            boxShadow: '0 3px 3px rgba(0, 0, 0, 0.3)',
          }}
          enter={{ height: noHeightAnimation ? undefined : 'auto', opacity: 1 }}
          leave={{ height: noHeightAnimation ? undefined : 0, opacity: 0 }}
          native
          config={config.fast}
        >
          {open =>
            open
              ? style => (
                  <animated.div style={style}>
                    <Overlay />
                  </animated.div>
                )
              : style => <animated.span style={style} />
          }
        </Transition>
      </div>
    );
  }
}

export default observer(OverlayComponent);
