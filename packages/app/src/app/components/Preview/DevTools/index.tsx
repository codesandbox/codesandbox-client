import * as React from 'react';
import { TweenMax, Elastic } from 'gsap';
import store from 'store/dist/store.modern';
import MinimizeIcon from 'react-icons/lib/fa/angle-up';

import Tooltip from 'common/components/Tooltip';

import Unread from './Unread';
import console from './Console';
import tests from './Tests';
import problems from './Problems';

import { Container, Header, Tab, Actions } from './elements';

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
    } catch (e) { } // eslint-disable-line
  }
}

interface NormalizedTouchEvent extends TouchEvent {
  clientX: number;
  clientY: number;
}

interface NormalizedReactTouchEvent extends React.TouchEvent<HTMLElement> {
  clientX: number;
  clientY: number;
}

function normalizeTouchEvent(cb): (event: TouchEvent) => any {
  return event =>
    cb({
      ...event,
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    } as NormalizedTouchEvent);
}

function normalizeReactTouchEvent(
  cb
): (event: React.TouchEvent<HTMLElement>) => any {
  return event =>
    cb({
      ...event,
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    } as NormalizedReactTouchEvent);
}

const PANES = {
  [console.title]: console,
  [problems.title]: problems,
  [tests.title]: tests,
} as {
  [paneType: string]: {
    title: string;
    Content: React.ComponentType<any>;
    actions: {
      title: string;
      onClick: () => void;
      Icon: React.ComponentType<any>;
    }[];
  };
};

enum StatusType {
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
  Clear = 'clear',
}

export type Status = {
  unread: number;
  type: StatusType;
};

type Props = {
  sandboxId: string;
  setDragging?: (dragging: boolean) => void;
  zenMode?: boolean;
  shouldExpandDevTools?: boolean;
  devToolsOpen?: boolean;
  setDevToolsOpen?: (open: boolean) => void;
  view?: 'browser' | 'console' | 'tests';
};

type State = {
  status: { [title: string]: Status };
  height: number;
  mouseDown: boolean;
  hidden: boolean;
  startY: number;
  startHeight: number;
  currentPane: string;
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

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
    document.addEventListener(
      'touchend',
      // @ts-ignore, f*** typing
      normalizeTouchEvent(this.handleMouseUp),
      false
    );
    document.addEventListener(
      'touchmove',
      // @ts-ignore, f*** typing
      normalizeTouchEvent(this.handleTouchMove),
      false
    );

    if (this.props.shouldExpandDevTools) {
      this.openDevTools();
    }
  }

  componentWillUnmount() {
    this.updateStatus = () => () => null;
    document.removeEventListener('mouseup', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    document.removeEventListener(
      'touchend',
      // @ts-ignore, f*** typing
      normalizeTouchEvent(this.handleTouchEnd),
      false
    );
    document.removeEventListener(
      'touchmove',
      // @ts-ignore, f*** typing
      normalizeTouchEvent(this.handleTouchMove),
      false
    );
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
    statusType: StatusType,
    count?: number
  ) => {
    if (!this.state.hidden && this.state.currentPane === title) {
      return;
    }

    const currentStatus = (statusType !== StatusType.Clear &&
      this.state.status[title]) || {
      unread: 0,
      type: StatusType.Info,
    };
    let newStatusType = currentStatus.type;

    if (
      statusType === StatusType.Success &&
      (newStatusType !== StatusType.Error &&
        newStatusType !== StatusType.Warning)
    ) {
      newStatusType = StatusType.Success;
    } else if (
      statusType === StatusType.Warning &&
      newStatusType !== StatusType.Error
    ) {
      newStatusType = StatusType.Warning;
    } else if (status === StatusType.Error) {
      newStatusType = StatusType.Error;
    }

    let unread =
      currentStatus.unread + (statusType !== StatusType.Clear ? 1 : 0);

    if (count != null) {
      unread = count;
    }

    this.setState({
      status: {
        ...this.state.status,
        [title]: {
          type: newStatusType,
          unread,
        },
      },
    });
  };

  handleMouseDown = (
    event:
      | MouseEvent
      | React.MouseEvent<HTMLElement>
      | NormalizedTouchEvent
      | NormalizedReactTouchEvent
  ) => {
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

  handleMouseUp = (
    e: MouseEvent | NormalizedTouchEvent | NormalizedReactTouchEvent
  ) => {
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
          const { height } = this.state;
          if (height > 64) {
            store.set('devtools.height', height);
          }
        }, 50);
      }
    }
  };

  handleMouseMove = (event: Event & { clientX: number; clientY: number }) => {
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

  setPane = (title: string) => {
    this.setState({
      currentPane: title,
      status: {
        ...this.state.status,
        [title]: {
          type: StatusType.Info,
          unread: 0,
        },
      },
    });
  };

  node: HTMLElement;

  render() {
    const { sandboxId, zenMode } = this.props;
    const { hidden, height, status } = this.state;

    const { actions } = PANES[this.state.currentPane];

    return (
      <Container
        innerRef={el => {
          this.node = el;
        }}
        style={{
          height,
          position: 'relative',
          display: 'flex',
        }}
      >
        <Header
          onTouchStart={normalizeReactTouchEvent(this.handleMouseDown)}
          onMouseDown={this.handleMouseDown}
        >
          {Object.keys(PANES).map(title => (
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
        {Object.keys(PANES).map(title => {
          const { Content } = PANES[title];
          return (
            <Content
              key={title}
              hidden={hidden || title !== this.state.currentPane}
              updateStatus={this.updateStatus(title)}
              sandboxId={sandboxId}
            />
          );
        })}
      </Container>
    );
  }
}
