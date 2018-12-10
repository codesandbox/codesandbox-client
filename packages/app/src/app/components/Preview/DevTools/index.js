// @flow
import React from 'react';

import { TweenMax, Elastic } from 'gsap';
import store from 'store/dist/store.modern';
import MinimizeIcon from 'react-icons/lib/fa/angle-up';

import Tooltip from 'common/components/Tooltip';
import type { Template } from 'common/templates';

import Unread from './Unread';
import console from './Console';
import tests from './Tests';
import problems from './Problems';
import terminal from './Terminal';

import { Container, Header, Tab, Actions } from './elements';

function unFocus(document, window) {
  if (document.selection) {
    // $FlowIssue
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

function normalizeTouchEvent(event: TouchEvent): MouseEvent {
  // $FlowIssue
  return {
    ...event,
    clientX: event.touches[0].clientX,
    clientY: event.touches[0].clientY,
  };
}

const PANES = {
  [console.title]: console,
  [problems.title]: problems,
  [tests.title]: tests,
  [terminal.title]: terminal,
};

export type Status = {
  unread: number,
  type: 'info' | 'warning' | 'error',
};

type Props = {
  sandboxId: string,
  template: Template,
  setDragging?: (dragging: boolean) => void,
  zenMode?: boolean,
  shouldExpandDevTools?: boolean,
  devToolsOpen?: boolean,
  setDevToolsOpen?: (open: boolean) => void,
  view?: 'browser' | 'console' | 'tests',
  owned: boolean,
};
type State = {
  status: { [title: string]: ?Status },
  height: number,
  mouseDown: boolean,
  hidden: boolean,
  startY: number,
  startHeight: number,
  currentPane: string,
};

export default class DevTools extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const hasView = props.view && props.view !== 'browser';

    let currentPane = PANES[Object.keys(PANES)[0]].title;
    if (hasView) {
      if (props.view === 'tests') {
        currentPane = tests.title;
      } else if (props.view === 'console') {
        currentPane = console.title;
      }
    }

    this.state = {
      status: {},
      currentPane,

      mouseDown: false,
      startY: 0,
      startHeight: 0,

      hidden: !hasView,

      height: hasView ? 5000 : 2 * 16,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sandboxId !== this.props.sandboxId) {
      this.setState({
        status: {},
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
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

  /**
   * This stops the propagation of the mousewheel event so the editor itself cannot
   * block it to prevent gesture scrolls. Without this scrolling won't work in the
   * console.
   */
  mouseWheelHandler = (e: WheelEvent) => {
    e.stopPropagation();
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
    document.addEventListener('touchend', this.handleTouchEnd, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);

    if (this.node) {
      this.node.addEventListener('mousewheel', this.mouseWheelHandler);
    }

    if (this.props.shouldExpandDevTools) {
      this.openDevTools();
    }
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-unused-vars
    this.updateStatus = (title: string) => {};
    document.removeEventListener('mouseup', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    document.removeEventListener('touchend', this.handleTouchEnd, false);
    document.removeEventListener('touchmove', this.handleTouchMove, false);

    if (this.node) {
      this.node.removeEventListener('mousewheel', this.mouseWheelHandler);
    }
  }

  setHidden = (hidden: boolean) => {
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
    status: 'success' | 'warning' | 'error' | 'info' | 'clear',
    count?: number
  ) => {
    if (!this.state.hidden && this.state.currentPane === title) {
      return;
    }

    const currentStatus = (status !== 'clear' && this.state.status[title]) || {
      unread: 0,
      type: 'info',
    };
    let newStatus = currentStatus.type;

    if (
      status === 'success' &&
      (newStatus !== 'error' && newStatus !== 'warning')
    ) {
      newStatus = 'success';
    } else if (status === 'warning' && newStatus !== 'error') {
      newStatus = 'warning';
    } else if (status === 'error') {
      newStatus = 'error';
    }

    let unread = currentStatus.unread + (status !== 'clear' ? 1 : 0);

    if (count != null) {
      unread = count;
    }

    this.setState({
      status: {
        ...this.state.status,
        [title]: {
          type: newStatus,
          unread,
        },
      },
    });
  };

  handleTouchStart = (event: TouchEvent) => {
    if (event.touches && event.touches.length) {
      this.handleMouseDown(normalizeTouchEvent(event));
    }
  };

  handleMouseDown = (event: Event & { clientX: number, clientY: number }) => {
    if (!this.state.mouseDown) {
      unFocus(document, window);
      this.setState({
        startY: event.clientY,
        startHeight: this.state.height,
        mouseDown: true,
      });
      if (this.props.setDragging) {
        this.props.setDragging(true);
      }
    }
  };

  handleTouchEnd = (event: TouchEvent) => {
    this.handleMouseUp(event);
  };

  handleMouseUp = (e: Event) => {
    if (this.state.mouseDown) {
      this.setState({ mouseDown: false });
      if (this.props.setDragging) {
        this.props.setDragging(false);
      }

      if (
        Math.abs(this.state.startHeight - this.state.height) < 30 &&
        this.state.hidden
      ) {
        e.preventDefault();
        e.stopPropagation();
        this.handleClick();
      } else {
        setTimeout(() => {
          const height = this.state.height;
          if (height > 64) {
            store.set('devtools.height', height);
          }
        }, 50);
      }
    }
  };

  handleTouchMove = (event: TouchEvent) => {
    if (event.touches && event.touches.length) {
      this.handleMouseMove(normalizeTouchEvent(event));
    }
  };

  handleMouseMove = (event: Event & { clientX: number, clientY: number }) => {
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

  handleMinimizeClick = (e: MouseEvent) => {
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
    if (this.props.setDevToolsOpen) {
      this.props.setDevToolsOpen(true);
    }
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
    if (this.props.setDevToolsOpen) {
      this.props.setDevToolsOpen(false);
    }
    TweenMax.to(heightObject, 0.3, {
      height: 32,
      onUpdate: () => {
        this.setState(heightObject);
      },
      ease: Elastic.easeOut.config(0.25, 1),
    });
  };

  setPane = (title: string) => {
    this.setState({
      currentPane: title,
      status: {
        ...this.state.status,
        [title]: {
          type: 'info',
          unread: 0,
        },
      },
    });
  };

  node: HTMLElement;

  render() {
    const { sandboxId, template, zenMode, owned } = this.props;
    const { hidden, height, status } = this.state;

    const { actions: actionsOrFunction } = PANES[this.state.currentPane];
    const actions =
      typeof actionsOrFunction === 'function'
        ? actionsOrFunction(owned)
        : actionsOrFunction;

    const PANES_TO_SHOW = Object.keys(PANES).filter(
      paneName =>
        PANES[paneName].show === undefined || PANES[paneName].show(template)
    );

    return (
      <Container
        ref={el => {
          this.node = el;
        }}
        height={height}
      >
        <Header
          onTouchStart={this.handleTouchStart}
          onMouseDown={this.handleMouseDown}
        >
          {PANES_TO_SHOW.map(title => (
            <Tab
              active={title === this.state.currentPane}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.setPane(title);
              }}
              key={title}
            >
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
        {PANES_TO_SHOW.map(title => {
          const { Content } = PANES[title];
          return (
            <Content
              key={title}
              hidden={hidden || title !== this.state.currentPane}
              updateStatus={this.updateStatus(title)}
              sandboxId={sandboxId}
              height={this.state.height}
              openDevTools={this.openDevTools}
              hideDevTools={this.hideDevTools}
              selectCurrentPane={() => {
                this.setPane(title);
              }}
            />
          );
        })}
      </Container>
    );
  }
}
