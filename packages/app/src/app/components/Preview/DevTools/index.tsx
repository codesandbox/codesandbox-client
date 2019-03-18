import * as React from 'react';

import { TweenMax, Elastic } from 'gsap';
import store from 'store/dist/store.modern';
import FaAngleUp from 'react-icons/lib/fa/angle-up';

import { TemplateType } from 'common/lib/templates';

import console from './Console';
import tests from './Tests';
import problems from './Problems';
import terminal from './Terminal';

import { Container, Header, ContentContainer } from './elements';
import { ViewConfig } from 'common/lib/templates/template';
import Tabs, { ITabPosition } from './Tabs';

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

function normalizeTouchEvent(
  event: React.TouchEvent | TouchEvent
): React.MouseEvent & MouseEvent {
  // @ts-ignore
  return {
    ...event,
    clientX: event.touches[0].clientX,
    clientY: event.touches[0].clientY,
  };
}

export interface IViews {
  [id: string]: IViewType;
}

export interface IViewAction {
  title: string;
  onClick: () => void;
  Icon: React.ComponentClass<any, any>;
}

export interface IViewType {
  id: string;
  title: string;
  Content: React.ComponentClass<any, any>;
  actions: IViewAction[] | ((owner: boolean) => IViewAction[]);
}

export type StatusType = 'info' | 'warning' | 'error' | 'success' | 'clear';

export type Status = {
  unread: number;
  type: StatusType;
};

export type DevToolProps = {
  hidden: boolean;
  updateStatus: (type: StatusType, count?: number) => {};
  sandboxId: string;
  height: number;
  openDevTools: () => void;
  hideDevTools: () => void;
  selectCurrentPane: () => void;
};

const VIEWS: IViews = {
  [console.id]: console,
  [problems.id]: problems,
  [tests.id]: tests,
  [terminal.id]: terminal,
};

type Props = {
  sandboxId: string;
  template: TemplateType;
  setDragging?: (dragging: boolean) => void;
  zenMode?: boolean;
  shouldExpandDevTools?: boolean;
  devToolsOpen?: boolean;
  setDevToolsOpen?: (open: boolean) => void;
  view?: 'browser' | 'console' | 'tests';
  owned: boolean;
  primary: boolean;
  viewConfig: ViewConfig;
  devToolIndex: number;
  moveTab?: (prevPos: ITabPosition, nextPos: ITabPosition) => void;
  addedViews?: IViews;
  hideTabs?: boolean;
};
type State = {
  status: { [title: string]: Status | undefined };
  height: number | string;
  mouseDown: boolean;
  hidden: boolean;
  startY: number;
  startHeight: number;
  currentPaneIndex: number;
};

export default class DevTools extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const isOpen = !!props.viewConfig.open;

    this.allViews = props.addedViews
      ? { ...VIEWS, ...props.addedViews }
      : VIEWS;

    this.state = {
      status: {},
      currentPaneIndex: 0,

      mouseDown: false,
      startY: 0,
      startHeight: 0,
      height: isOpen ? '40%' : this.height(),

      hidden: !props.primary && !isOpen,
    };
  }

  normalizeHeight = (el: HTMLDivElement) => {
    if (typeof this.state.height === 'string') {
      const { height } = el.getBoundingClientRect();

      this.setState({ height });
    }
  };

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

  height = () => (this.props.primary ? 35 : 28);

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
    this.updateStatus = (title: string) => (
      type: StatusType,
      count?: number
    ) => {};
    document.removeEventListener('mouseup', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
    document.removeEventListener('touchend', this.handleTouchEnd, false);
    document.removeEventListener('touchmove', this.handleTouchMove, false);

    if (this.node) {
      this.node.removeEventListener('mousewheel', this.mouseWheelHandler);
    }
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    if (state.currentPaneIndex >= props.viewConfig.views.length) {
      return { ...state, currentPaneIndex: props.viewConfig.views.length - 1 };
    }

    return state;
  }

  setHidden = (hidden: boolean) => {
    if (!hidden) {
      return this.setState({
        status: {
          ...this.state.status,
          [this.getCurrentPane().id]: null,
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

  getCurrentPane = () => {
    return this.props.viewConfig.views[this.state.currentPaneIndex];
  };

  updateStatus = (id: string) => (
    status: 'success' | 'warning' | 'error' | 'info' | 'clear',
    count?: number
  ) => {
    if (!this.state.hidden && this.getCurrentPane().id === id) {
      return;
    }

    const currentStatus = (status !== 'clear' && this.state.status[id]) || {
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
        [id]: {
          type: newStatus,
          unread,
        },
      },
    });
  };

  handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches && event.touches.length) {
      this.handleMouseDown(normalizeTouchEvent(event));
    }
  };

  handleMouseDown = (
    event: React.MouseEvent & { clientX: number; clientY: number }
  ) => {
    if (!this.state.mouseDown && typeof this.state.height === 'number') {
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
        typeof this.state.height === 'number' &&
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

  handleMouseMove = (
    event: MouseEvent & { clientX: number; clientY: number }
  ) => {
    if (this.state.mouseDown) {
      const newHeight =
        this.state.startHeight - (event.clientY - this.state.startY);

      this.setState({
        height: Math.max(this.height() - 2, newHeight),
      });
      this.setHidden(newHeight < 64);
    }
  };

  handleClick = () => {
    this.openDevTools();
  };

  handleMinimizeClick = (e: React.MouseEvent<React.ReactSVGElement>) => {
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
      height: this.height(),
      onUpdate: () => {
        this.setState(heightObject);
      },
      ease: Elastic.easeOut.config(0.25, 1),
    });
  };

  setPane = (index: number) => {
    if (this.state.hidden && !this.props.primary) {
      this.openDevTools();
    }
    this.setState({
      currentPaneIndex: index,
      status: {
        ...this.state.status,
        [this.props.viewConfig.views[index].id]: {
          type: 'info',
          unread: 0,
        },
      },
    });
  };

  getViews = (): IViews => {
    return this.allViews;
  };

  node: HTMLElement;
  allViews: IViews;

  render() {
    const {
      hideTabs,
      sandboxId,
      owned,
      primary,
      viewConfig,
      devToolIndex,
    } = this.props;
    const { hidden, height } = this.state;

    const panes = viewConfig.views;

    return (
      <Container
        ref={el => {
          this.node = el;
          this.normalizeHeight(el);
        }}
        style={{
          height: primary ? '100%' : height,
          minHeight: height,
          position: 'relative',
          display: 'flex',
        }}
      >
        {!hideTabs && (
          <Header
            onTouchStart={!primary && this.handleTouchStart}
            onMouseDown={!primary && this.handleMouseDown}
            primary={primary}
            open={!this.state.hidden}
          >
            <Tabs
              owned={owned}
              panes={panes.map(p => this.getViews()[p.id])}
              currentPaneIndex={this.state.currentPaneIndex}
              hidden={hidden}
              setPane={this.setPane}
              devToolIndex={devToolIndex}
              moveTab={
                this.props.moveTab
                  ? (prevPos, nextPos) => {
                      if (prevPos.devToolIndex === this.props.devToolIndex) {
                        this.setState({
                          currentPaneIndex: nextPos.tabPosition,
                        });
                      }

                      this.props.moveTab(prevPos, nextPos);
                    }
                  : undefined
              }
            />

            {!primary && (
              <FaAngleUp
                onMouseDown={hidden ? undefined : this.handleMinimizeClick}
                style={{
                  marginTop: hidden ? 0 : 4,
                  transform: hidden ? `rotateZ(0deg)` : `rotateZ(180deg)`,
                  cursor: 'pointer',
                }}
              />
            )}
          </Header>
        )}
        <ContentContainer>
          {panes.map((view, i) => {
            const { Content } = this.getViews()[view.id];
            return (
              <Content
                key={view.id}
                hidden={hidden || i !== this.state.currentPaneIndex}
                updateStatus={this.updateStatus(view.id)}
                sandboxId={sandboxId}
                height={this.state.height}
                openDevTools={this.openDevTools}
                hideDevTools={this.hideDevTools}
                selectCurrentPane={() => {
                  this.setPane(i);
                }}
              />
            );
          })}
        </ContentContainer>
      </Container>
    );
  }
}
