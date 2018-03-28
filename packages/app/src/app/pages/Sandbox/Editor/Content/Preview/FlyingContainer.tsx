import * as React from 'react';
import { connect } from 'app/fluent';

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
  children: (funcs: { resize: Function }) => React.ReactNode,
  onPositionChange?: () => void,
};

type State = {
  resizing?: boolean
  dragging?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
};

export default connect<Props>()
  .with(({ state, signals }) => ({
    previewWindow: state.editor.previewWindow,
    setPreviewBounds: signals.editor.setPreviewBounds,
    resizingStarted: signals.editor.resizingStarted,
    resizingStopped: signals.editor.resizingStopped
  }))
  .toClass(props =>
    class FlyingContainer extends React.Component<typeof props, State> {
      state = {
        resizing: false,
        dragging: false,
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
      };

      el?: HTMLElement;
      initialWidth?: number;
      initialHeight?: number;

      updateBounds = el => {
        if (el) {
          this.el = el;
          const { width, height } = this.el.getBoundingClientRect();
          this.initialWidth = width;
          this.initialHeight = height;

          this.props.setPreviewBounds({ width, height });
        }
      };

      handleStartDrag = () => {
        this.setState({ dragging: true });
        this.setResizingStarted();

        if (this.props.onPositionChange) {
          this.props.onPositionChange();
        }
      };

      handleStopDrag = (e, data) => {
        const { x, y } = data;
        this.setState({ dragging: false });

        // We only set the bounds in the global store on stop, otherwise there are
        // other components constantly recalculating while dragging -> lag
        this.props.setPreviewBounds({ x, y });
        this.setResizingStopped();
      };

      setResizingStarted = () => {
        this.props.resizingStarted();

        if (this.props.onPositionChange) {
          this.props.onPositionChange();
        }
      };

      setResizingStopped = () => {
        this.props.resizingStopped();

        // We do this to force a recalculation of the iframe height, this doesn't
        // happen when pointer events are disabled and in turn disables scroll.
        // It's hacky, but it's to fix a bug in the browser.
        setTimeout(() => {
          const { previewWindow } = this.props

          this.props.setPreviewBounds({
            height: previewWindow.height + 1,
          });
        });
      };

      applyStateToStore = () => {
        const { x, y, width, height } = this.state;
        this.props.setPreviewBounds({ x, y, width, height });

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
        e: React.MouseEvent<HTMLDivElement>,
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

        const handleMouseMove = (dragEvent: MouseEvent) => {
          const { previewWindow } = this.props;

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

          const update: {
            height?: number
            width?: number
            x?: number
            y?: number
          } = {};

          if (vertical) {
            update.height = Math.max(48, newSizeY);
          }
          if (horizontal) {
            update.width = Math.max(48, newSizeX);
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
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          this.setResizingStopped();

          this.applyStateToStore();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      resizeTo = ({ x, y, width, height }) => {
        this.setState({ resizing: true }, () => {
          const currentState = { ...this.props.previewWindow };
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
        const { previewWindow } = this.props;

        const width = this.state.width || previewWindow.width;
        const height = this.state.height || previewWindow.height;

        return (
          <Draggable
            onStart={this.handleStartDrag}
            onStop={this.handleStopDrag}
            defaultPosition={{
              x: previewWindow.x,
              y: previewWindow.y,
            }}
            bounds={{ top: -48, left: null, right: null, bottom: null }}
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
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.5)',
                zIndex: 60,
                cursor: 'move',
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
  )
