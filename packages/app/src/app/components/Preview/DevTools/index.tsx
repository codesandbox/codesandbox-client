import { TemplateType } from '@codesandbox/common/lib/templates';
import { ViewConfig } from '@codesandbox/common/lib/templates/template';
import { DevToolsTabPosition } from '@codesandbox/common/lib/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { Elastic, TweenMax } from 'gsap';
import React from 'react';
import FaAngleUp from 'react-icons/lib/fa/angle-up';
import store from 'store/dist/store.modern';

import { console } from './Console';
import { Container, ContentContainer, Header } from './elements';
import { problems } from './Problems';
import { reactDevTools } from './React-Devtools';
import { DevToolTabs } from './Tabs';
import { terminal } from './Terminal';
import { tests } from './Tests';

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch {}
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

interface IViewAction {
  title: string;
  onClick: () => void;
  Icon: React.ComponentType<any>;
  disabled?: boolean;
}

export interface IViewType {
  id: string;
  title: string | ((options: any) => string);
  Content: React.ComponentType<any>;
  actions: IViewAction[] | ((info: { owned: boolean }) => IViewAction[]);
}

export type StatusType = 'info' | 'warning' | 'error' | 'success' | 'clear';

export type Status = {
  unread: number;
  type: StatusType;
};

export type DevToolProps = {
  hidden: boolean;
  disableLogging: boolean;
  updateStatus: (type: StatusType, count?: number) => void;
  sandboxId: string;
  openDevTools: () => void;
  hideDevTools: () => void;
  selectCurrentPane: () => void;
  owned: boolean;
  options: any;
};

const VIEWS: IViews = {
  [console.id]: console,
  [problems.id]: problems,
  [tests.id]: tests,
  [terminal.id]: terminal,
  [reactDevTools.id]: reactDevTools,
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
  moveTab?: (
    prevPos: DevToolsTabPosition,
    nextPos: DevToolsTabPosition
  ) => void;
  closeTab?: (pos: DevToolsTabPosition) => void;
  setPane: (pos: DevToolsTabPosition) => void;
  addedViews?: IViews;
  hideTabs?: boolean;
  currentDevToolIndex: number;
  currentTabPosition: number;
  disableLogging?: boolean;
  isOnEmbedPage: boolean;
};
type State = {
  status: { [title: string]: Status | undefined };
  height: number | string;
  mouseDown: boolean;
  hidden: boolean;
  startY: number;
  startHeight: number;
  currentTabIndex: number;
};

export class DevTools extends React.PureComponent<Props, State> {
  draftState: State | null = null;
  constructor(props: Props) {
    super(props);

    const isOpen = Boolean(props.viewConfig.open);

    this.allViews = props.addedViews
      ? { ...VIEWS, ...props.addedViews }
      : VIEWS;

    this.state = {
      status: {},

      mouseDown: false,
      startY: 0,
      startHeight: 0,
      height: isOpen ? '40%' : this.closedHeight(),

      hidden: !props.primary && !isOpen,

      currentTabIndex: 0,
    };
  }

  setStateTimer = null;
  /**
   * We can call setState 100s of times per second, which puts great strain
   * on rendering from React. We debounce the rendering so that we flush changes
   * after a while. This prevents the editor from getting stuck.
   *
   * Every setState call will have to go through this, otherwise we get race conditions
   * where the underlying state has changed, but the draftState didn't change.
   */
  setStateDelayedFlush = (
    setStateFunc:
      | Partial<State>
      | ((state: State, props: Props) => Partial<State>),
    time = 200,
    callback?: () => void
  ) => {
    const draftState = this.draftState || this.state;

    const newState =
      typeof setStateFunc === 'function'
        ? setStateFunc(draftState, this.props)
        : setStateFunc;
    this.draftState = { ...draftState, ...newState };

    if (this.setStateTimer) {
      clearTimeout(this.setStateTimer);
    }

    const updateFunc = () => {
      if (this.draftState) {
        this.setState(this.draftState, callback);
      }

      this.draftState = null;
      this.setStateTimer = null;
    };

    if (time === 0) {
      updateFunc();
    } else {
      this.setStateTimer = window.setTimeout(updateFunc, time);
    }
  };

  normalizeHeight = (el: HTMLDivElement) => {
    if (typeof this.state.height === 'string') {
      const { height } = el.getBoundingClientRect();

      this.setStateDelayedFlush({ height }, 0);
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

  closedHeight = () => (this.props.primary ? 35 : 28);

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

    clearTimeout(this.setStateTimer);

    if (this.node) {
      this.node.removeEventListener('mousewheel', this.mouseWheelHandler);
    }
  }

  setHidden = (hidden: boolean) => {
    if (!hidden) {
      return this.setStateDelayedFlush(
        state => ({
          status: {
            ...state.status,
            [this.getCurrentPane().id]: null,
          },
          hidden: false,
        }),
        0
      );
    }

    return this.setStateDelayedFlush({ hidden }, 0, () => {
      if (this.props.setDevToolsOpen) {
        const { setDevToolsOpen } = this.props;
        setTimeout(() => setDevToolsOpen(!this.state.hidden), 100);
      }
    });
  };

  getCurrentPane = () =>
    this.props.viewConfig.views[this.state.currentTabIndex];

  updateStatus = (id: string) => (
    status: 'success' | 'warning' | 'error' | 'info' | 'clear',
    count?: number
  ) => {
    this.setStateDelayedFlush(state => {
      const currentStatus = (status !== 'clear' && state.status[id]) || {
        unread: 0,
        type: 'info',
      };
      let newStatus = currentStatus.type;

      if (
        status === 'success' &&
        newStatus !== 'error' &&
        newStatus !== 'warning'
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
      return {
        status: {
          ...state.status,
          [id]: {
            type: newStatus,
            unread,
          },
        },
      };
    }, 50);
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
      const { clientY } = event;
      unFocus(document, window);
      this.setStateDelayedFlush(
        // @ts-ignore
        state => ({
          startY: clientY,
          startHeight: state.height,
          mouseDown: true,
        }),
        0
      );
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
      this.setStateDelayedFlush({ mouseDown: false }, 0);
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
          const { height } = this.state;
          if (typeof height === 'number' && height > 64) {
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
      let maxHeight = 0;
      if (this.node) {
        maxHeight = this.node.parentElement.getBoundingClientRect().height;
      }

      const newHeight = Math.min(
        maxHeight,
        this.state.startHeight - (event.clientY - this.state.startY)
      );

      this.setStateDelayedFlush(
        {
          height: Math.max(this.closedHeight() - 2, newHeight),
        },
        0
      );
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
        this.setStateDelayedFlush(heightObject, 0);
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
      height: this.closedHeight(),
      onUpdate: () => {
        this.setStateDelayedFlush(heightObject, 0);
      },
      ease: Elastic.easeOut.config(0.25, 1),
    });
  };

  setPane = (index: number) => {
    if (this.state.hidden && !this.props.primary) {
      this.openDevTools();
    }
    const pane = this.props.viewConfig.views[index];
    if (pane) {
      track('DevTools - Open Pane', { pane: pane.id });
    }

    this.props.setPane({
      devToolIndex: this.props.devToolIndex,
      tabPosition: index,
    });
  };

  /**
   * Set the current tab based on whether the selection has changed to the current
   * devtools
   */
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.devToolIndex === props.currentDevToolIndex) {
      return {
        currentTabIndex: Math.min(
          props.currentTabPosition,
          props.viewConfig.views.length - 1
        ),
      };
    }

    // Prevent selecting the last tab
    if (state.currentTabIndex > props.viewConfig.views.length - 1) {
      return { currentTabIndex: props.viewConfig.views.length - 1 };
    }

    return null;
  }

  getViews = (): IViews => this.allViews;

  node: HTMLDivElement;

  allViews: IViews;

  render() {
    const {
      hideTabs,
      sandboxId,
      owned,
      primary,
      viewConfig,
      devToolIndex,
      disableLogging,
    } = this.props;
    const { hidden, height } = this.state;

    const panes = viewConfig.views;

    return (
      <Container
        ref={el => {
          this.node = el || this.node;

          if (this.node) {
            this.normalizeHeight(this.node);
          }
        }}
        style={{
          flex: primary
            ? '1 1 0'
            : `0 0 ${height}${typeof height === 'number' ? 'px' : ''}`,
          minHeight: 0,
        }}
      >
        {!hideTabs && panes.length > 0 && (
          <Header
            onTouchStart={!primary ? this.handleTouchStart : undefined}
            onMouseDown={!primary ? this.handleMouseDown : undefined}
            primary={primary}
            open={!this.state.hidden}
          >
            <DevToolTabs
              owned={owned}
              panes={panes}
              views={this.getViews()}
              currentPaneIndex={this.state.currentTabIndex}
              hidden={hidden}
              setPane={this.setPane}
              devToolIndex={devToolIndex}
              status={this.state.status}
              moveTab={this.props.moveTab}
              closeTab={this.props.closeTab}
              disableLogging={disableLogging}
              isOnEmbedPage={this.props.isOnEmbedPage}
              // @ts-ignore
              isOnPrem={window._env_?.IS_ONPREM === 'true'}
            />

            {!primary && (
              <FaAngleUp
                onMouseDown={hidden ? undefined : this.handleMinimizeClick}
                style={{
                  alignSelf: 'center',
                  transform: hidden ? `rotateZ(0deg)` : `rotateZ(180deg)`,
                  cursor: 'pointer',
                }}
              />
            )}
          </Header>
        )}
        <ContentContainer>
          {panes.map((view, i) => {
            if (!this.getViews()[view.id]) return null;
            const { Content } = this.getViews()[view.id];

            return (
              <Content
                key={view.id + JSON.stringify(view.options)}
                owned={owned}
                hidden={hidden || i !== this.state.currentTabIndex}
                updateStatus={this.updateStatus(view.id)}
                sandboxId={sandboxId}
                disableLogging={disableLogging}
                openDevTools={this.openDevTools}
                hideDevTools={this.hideDevTools}
                selectCurrentPane={() => {
                  this.setPane(i);
                }}
                options={view.options || {}}
              />
            );
          })}
        </ContentContainer>
      </Container>
    );
  }
}
