// @flow
import React from 'react';

import { TweenMax, Elastic } from 'gsap';
import store from 'store/dist/store.modern';
import MinimizeIcon from 'react-icons/lib/fa/angle-up';

import Tooltip from 'common/components/Tooltip';

import Unread from './Unread';
import console from './Console';

import { Container, Header, Tab, Actions } from './elements';

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

function normalizeTouchEvent(event) {
  return {
    ...event,
    clientX: event.touches[0].clientX,
    clientY: event.touches[0].clientY,
  };
}

const PANES = { [console.title]: console };

export default class DevTools extends React.PureComponent {
  state = {
    status: {},
    currentPane: PANES[Object.keys(PANES)[0]].title,

    mouseDown: false,
    startY: 0,
    startHeight: 0,

    hidden: true,

    height: 2 * 16,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.setState({
        status: {},
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.devToolsOpen !== prevProps.devToolsOpen &&
      prevState.hidden === this.state.hidden
    ) {
      if (this.props.devToolsOpen === true && this.state.hidden) {
        this.openDevTools();
      } else if (this.props.devToolsOpen === false && !this.state.hidden) {
        this.hideDevTools();
      }
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
    document.addEventListener('touchend', this.handleTouchEnd, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);

    if (this.props.shouldExpandDevTools) {
      this.openDevTools();
    }
  }

  componentWillUnmount() {
    this.updateStatus = () => {};
    document.removeEventListener('mouseup', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    document.removeEventListener('touchend', this.handleTouchEnd, false);
    document.removeEventListener('touchmove', this.handleTouchMove, false);
  }

  setHidden = hidden => {
    if (!hidden) {
      return this.setState({
        status: {
          ...this.state.status,
          [this.state.currentPane]: null,
        },
        hidden: false,
      });
    }

    return this.setState({ hidden }, () => {
      if (this.props.setDevToolsOpen) {
        const { setDevToolsOpen } = this.props;
        setTimeout(() => setDevToolsOpen(!this.state.hidden), 100);
      }
    });
  };

  updateStatus = (title: string) => (
    status: 'warning' | 'error' | 'info' | 'clear'
  ) => {
    if (!this.state.hidden) {
      return;
    }

    const currentStatus = (status !== 'clear' && this.state.status[title]) || {
      unread: 0,
      type: 'info',
    };
    let newStatus = currentStatus.type;

    if (status === 'warning' && newStatus !== 'error') {
      newStatus = 'warning';
    } else if (status === 'error') {
      newStatus = 'error';
    }

    this.setState({
      status: {
        [title]: {
          type: newStatus,
          unread: currentStatus.unread + (status !== 'clear' ? 1 : 0),
        },
      },
    });
  };

  handleTouchStart = event => {
    if (event.touches && event.touches.length) {
      this.handleMouseDown(normalizeTouchEvent(event));
    }
  };

  handleMouseDown = event => {
    if (!this.state.mouseDown) {
      unFocus(document, window);
      this.setState({
        startY: event.clientY,
        startHeight: this.state.height,
        mouseDown: true,
      });
      this.props.setDragging(true);
    }
  };

  handleTouchEnd = event => {
    this.handleMouseUp(event);
  };

  handleMouseUp = e => {
    if (this.state.mouseDown) {
      this.setState({ mouseDown: false });
      this.props.setDragging(false);

      if (
        Math.abs(this.state.startHeight - this.state.height) < 30 &&
        this.state.hidden
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.handleClick();
      } else {
        // We do this to force a recalculation of the iframe height, this doesn't
        // happen when pointer events are disabled and in turn disables scroll.
        // It's hacky, but it's to fix a bug in the browser.
        setTimeout(() => {
          const height = this.state.height + 1;
          this.setState({ height });
          if (height > 64) {
            store.set('devtools.height', height);
          }
        }, 50);
      }
    }
  };

  handleTouchMove = event => {
    if (event.touches && event.touches.length) {
      this.handleMouseMove(normalizeTouchEvent(event));
    }
  };

  handleMouseMove = event => {
    if (this.state.mouseDown) {
      const newHeight =
        this.state.startHeight - (event.clientY - this.state.startY);

      this.setState({
        height: Math.max(32, newHeight),
      });
      this.setHidden(newHeight < 64);
    }
  };

  handleClick = () => {
    this.openDevTools();
  };

  handleMinimizeClick = e => {
    if (!this.state.hidden) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        this.hideDevTools();
      });
    }
  };

  openDevTools = () => {
    this.setHidden(false);
    const heightObject = { height: this.state.height };
    TweenMax.to(heightObject, 0.3, {
      height: store.get('devtools.height') || 300,
      onUpdate: () => {
        this.setState(heightObject);
      },
      ease: Elastic.easeOut.config(0.25, 1),
    });
  };

  hideDevTools = () => {
    this.setHidden(true);
    const heightObject = { height: this.state.height };
    TweenMax.to(heightObject, 0.3, {
      height: 32,
      onUpdate: () => {
        this.setState(heightObject);
      },
      ease: Elastic.easeOut.config(0.25, 1),
    });
  };

  node;

  render() {
    const { sandboxId, zenMode } = this.props;
    const { hidden, height, status } = this.state;

    const { actions, Content } = PANES[this.state.currentPane];

    return (
      <Container
        innerRef={el => {
          this.node = el;
        }}
        style={{
          height,
          minHeight: height,
          position: 'relative',
          display: 'flex',
        }}
      >
        <Header
          onTouchStart={this.handleTouchStart}
          onMouseDown={this.handleMouseDown}
        >
          {Object.keys(PANES).map(title => (
            <Tab key={title}>
              {title}
              {!zenMode && (
                <Unread
                  status={status[title] ? status[title].type : 'info'}
                  unread={status[title] ? status[title].unread : 0}
                />
              )}
            </Tab>
          ))}

          <Actions>
            {actions.map(({ title, onClick, Icon }) => (
              <Tooltip
                style={{ pointerEvents: hidden ? 'none' : 'initial' }}
                title={title}
                key={title}
              >
                <Icon
                  style={{
                    opacity: hidden ? 0 : 1,
                  }}
                  onClick={onClick}
                  key={title}
                />
              </Tooltip>
            ))}

            <MinimizeIcon
              onMouseDown={hidden ? undefined : this.handleMinimizeClick}
              style={{
                transform: hidden ? `rotateZ(0deg)` : `rotateZ(180deg)`,
              }}
            />
          </Actions>
        </Header>
        <Content
          hidden={hidden}
          evaluateCommand={this.props.evaluateCommand}
          updateStatus={this.updateStatus(this.state.currentPane)}
          sandboxId={sandboxId}
        />
      </Container>
    );
  }
}
