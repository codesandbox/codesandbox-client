// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { TweenMax, Elastic } from 'gsap';

import Draggable from 'react-draggable';

import {
  TopResizer,
  RightResizer,
  BottomResizer,
  LeftResizer,
  NEResizer,
  SEResizer,
  SWResizer,
  NWResizer,
  ResizingNotice,
} from './elements';

type Props = {
  signals: any,
  store: any,
  children: (funcs: { resize: Function }) => React.Node,
  onPositionChange?: () => void,
  hide?: boolean,
};

type State = {
  resizing: boolean,
  dragging: boolean,
  x: ?number,
  y: ?number,
  width: ?number,
  height: ?number,
};

class FlyingContainer extends React.Component<Props, State> {
  state = {
    resizing: false,
    dragging: false,
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined,
  };

  el: ?HTMLElement;
  initialWidth: ?number;
  initialHeight: ?number;
  lastX: ?number;
  lastY: ?number;

  updateBounds = el => {
    if (el) {
      this.el = el;
      const { width, height } = this.el.getBoundingClientRect();
      this.initialWidth = width;
      this.initialHeight = height;

      if (
        this.props.store.editor.previewWindow.width == null &&
        this.props.store.editor.previewWindow.height == null
      ) {
        this.props.signals.editor.setPreviewBounds({ width, height });
      }
    }
  };

  handleStartDrag = () => {
    this.setState({ dragging: true });
    this.setResizingStarted();

    this.lastX = this.props.store.editor.previewWindow.x;
    this.lastY = this.props.store.editor.previewWindow.y;
  };

  handleStopDrag = (e, data) => {
    const { x, y } = data;
    const horizontalPosChanged = x !== this.lastX;
    const verticalPosChanged = y !== this.lastY;

    this.setState({ dragging: false });

    this.setResizingStopped(
      horizontalPosChanged,
      verticalPosChanged,
      false,
      false
    );

    // We only set the bounds in the global store on stop, otherwise there are
    // other components constantly recalculating while dragging -> lag
    this.props.signals.editor.setPreviewBounds({ x, y });
  };

  setResizingStarted = () => {
    this.props.signals.editor.resizingStarted();
  };

  setResizingStopped = (
    horizontalPosChanged = true,
    verticalPosChanged = true,
    widthChanged = true,
    heightChanged = true
  ) => {
    this.props.signals.editor.resizingStopped();

    if (
      horizontalPosChanged ||
      verticalPosChanged ||
      widthChanged ||
      heightChanged
    ) {
      if (this.props.onPositionChange) {
        this.props.onPositionChange(
          horizontalPosChanged,
          verticalPosChanged,
          widthChanged,
          heightChanged,
          { ...this.state }
        );
      }

      this.fixPreviewInteractivity();
    }
  };

  fixPreviewInteractivity = () => {
    // We do this to force a recalculation of the iframe height, this doesn't
    // happen when pointer events are disabled and in turn disables scroll.
    // It's hacky, but it's to fix a bug in the browser.
    setTimeout(() => {
      const { previewWindow } = this.props.store.editor;

      this.props.signals.editor.setPreviewBounds({
        height: previewWindow.height + 1,
      });
    });
  };

  applyStateToStore = () => {
    const { x, y, width, height } = this.state;

    const update = {};

    if (x !== undefined) {
      update.x = x;
    }
    if (y !== undefined) {
      update.y = y;
    }
    if (width !== undefined) {
      update.width = width;
    }
    if (height !== undefined) {
      update.height = height;
    }
    this.props.signals.editor.setPreviewBounds(update);

    this.setState({
      dragging: false,
      resizing: false,
      x: null,
      y: null,
      width: null,
      height: null,
    });
  };

  handleHeightResize = (
    e: MouseEvent,
    vertical: boolean,
    horizontal: boolean,
    changePositionY: boolean,
    changePositionX: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    this.setResizingStarted();
    this.setState({ resizing: true });

    let lastX = e.clientX;
    let lastY = e.clientY;
    let lastWidth = 0;
    let lastHeight = 0;

    const handleMouseMove = (dragEvent: MouseEvent) => {
      const { previewWindow } = this.props.store.editor;

      const deltaY = lastY - dragEvent.clientY;
      const deltaX = dragEvent.clientX - lastX;

      const previewHeight = this.state.height || previewWindow.height;
      const previewWidth = this.state.width || previewWindow.width;
      const previewY = this.state.y || previewWindow.y;
      const previewX = this.state.x || previewWindow.x;

      const newSizeY = changePositionY
        ? previewHeight + deltaY
        : previewHeight - deltaY;
      const newSizeX = changePositionX
        ? previewWidth + deltaX
        : previewWidth - deltaX;

      const update = {};

      if (vertical) {
        lastHeight = Math.max(48, newSizeY);

        update.height = lastHeight;
      }
      if (horizontal) {
        lastWidth = Math.max(48, newSizeX);

        update.width = lastWidth;
      }

      if (changePositionY) {
        const newPosY = previewY - deltaY;

        update.y = Math.max(-48, newPosY);
      }

      if (changePositionX) {
        const newPosX = previewX + deltaX;

        update.x = newPosX;
      }

      // First do local, only propagate to store when finished
      this.setState(update);

      lastY = dragEvent.clientY;
      lastX = dragEvent.clientX;
    };

    const handleMouseUp = () => {
      const currentState = this.props.store.editor.previewWindow;
      const { x, y, width, height } = this.state;

      const horizontalPosChanged = x != null && x !== currentState.x;
      const verticalPosChanged = y != null && y !== currentState.y;
      const widthChanged = width != null && width !== currentState.width;
      const heightChanged = height != null && height !== currentState.height;

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      this.setResizingStopped(
        horizontalPosChanged,
        verticalPosChanged,
        widthChanged,
        heightChanged
      );

      this.applyStateToStore();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  resizeTo = ({ x, y, width, height }) => {
    this.setState({ resizing: true }, () => {
      const currentState = { ...this.props.store.editor.previewWindow };
      TweenMax.to(currentState, 0.5, {
        x,
        y,
        width: width == null ? this.initialWidth : width,
        height: height == null ? this.initialHeight : height,
        onUpdate: () => {
          this.setState(currentState);
        },
        onComplete: () => {
          this.applyStateToStore();
        },
        ease: Elastic.easeInOut.config(0.25, 1),
      });
    });
  };

  render() {
    const { hide } = this.props;
    const { previewWindow } = this.props.store.editor;

    const width = this.state.width || previewWindow.width;
    const height = this.state.height || previewWindow.height;

    return (
      <Draggable
        onStart={this.handleStartDrag}
        onStop={this.handleStopDrag}
        handle=".flying-container-handler"
        defaultPosition={{
          x: previewWindow.x,
          y: previewWindow.y,
        }}
        bounds={{ top: -48 }}
        position={
          this.state.dragging
            ? undefined
            : {
                x: this.state.x || previewWindow.x,
                y: this.state.y || previewWindow.y,
              }
        }
      >
        <div
          style={{
            position: 'absolute',
            right: '.5rem',
            top: '.5rem',
            bottom: '.5rem',

            overflow: 'hidden',
            borderRadius: '4px',
            width: width || '50%',
            flex: width ? `0 0 ${width}px` : undefined,
            height,
            boxShadow: hide ? 'none' : '0 3px 8px rgba(0, 0, 0, 0.5)',
            zIndex: 60,

            visiblity: hide ? 'hidden' : undefined,
            pointerEvents: hide ? 'none' : undefined,
          }}
          ref={this.updateBounds}
        >
          <TopResizer
            onMouseDown={e =>
              this.handleHeightResize(e, true, false, true, false)
            }
          />
          <RightResizer
            onMouseDown={e =>
              this.handleHeightResize(e, false, true, false, true)
            }
          />
          <BottomResizer
            onMouseDown={e =>
              this.handleHeightResize(e, true, false, false, false)
            }
          />
          <LeftResizer
            onMouseDown={e =>
              this.handleHeightResize(e, false, true, false, false)
            }
          />
          <NEResizer
            onMouseDown={e =>
              this.handleHeightResize(e, true, true, true, true)
            }
          />
          <SEResizer
            onMouseDown={e =>
              this.handleHeightResize(e, true, true, false, true)
            }
          />
          <SWResizer
            onMouseDown={e =>
              this.handleHeightResize(e, true, true, false, false)
            }
          />
          <NWResizer
            onMouseDown={e =>
              this.handleHeightResize(e, true, true, true, false)
            }
          />
          {this.props.children({ resize: this.resizeTo })}

          {this.state.resizing && (
            <ResizingNotice>
              {Math.floor(width)} x{' '}
              {Math.floor(height - 2.5 * 16 /* navigation bar */)}
            </ResizingNotice>
          )}
        </div>
      </Draggable>
    );
  }
}

export default inject('signals', 'store')(observer(FlyingContainer));
