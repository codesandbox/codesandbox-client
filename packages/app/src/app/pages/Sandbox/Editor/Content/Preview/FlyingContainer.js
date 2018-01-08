import React, { MouseEvent } from 'react';
import { inject, observer } from 'mobx-react';

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

class FlyingContainer extends React.Component {
  state = { resizing: false };

  updateBounds = el => {
    if (el) {
      this.el = el;
    }
  };

  handleDrag = (e, data) => {
    const { x, y } = data;

    this.props.signals.editor.setPreviewBounds({ x, y });
  };

  setResizingStarted = () => {
    this.setState({ resizing: true });
    this.props.signals.editor.resizingStarted();
  };

  setResizingStopped = () => {
    this.setState({ resizing: false });
    this.props.signals.editor.resizingStopped();
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

    let lastX = e.clientX;
    let lastY = e.clientY;

    const handleMouseMove = (dragEvent: MouseEvent) => {
      const { previewWindow } = this.props.store.editor;

      const deltaY = lastY - dragEvent.clientY;
      const deltaX = dragEvent.clientX - lastX;

      let previewHeight = previewWindow.height;
      if (!previewHeight) {
        const { height } = this.el.getBoundingClientRect();
        previewHeight = height;
      }

      let previewWidth = previewWindow.width;
      if (!previewWidth) {
        const { width } = this.el.getBoundingClientRect();
        previewWidth = width;
      }

      const newSizeY = changePositionY
        ? previewHeight + deltaY
        : previewHeight - deltaY;
      const newSizeX = changePositionX
        ? previewWidth + deltaX
        : previewWidth - deltaX;

      const update = {};

      if (vertical) {
        update.height = newSizeY;
      }
      if (horizontal) {
        update.width = newSizeX;
      }

      if (changePositionY) {
        const newPosY = previewWindow.y - deltaY;

        update.y = newPosY;
      }

      if (changePositionX) {
        const newPosX = previewWindow.x + deltaX;

        update.x = newPosX;
      }

      this.props.signals.editor.setPreviewBounds(update);
      lastY = dragEvent.clientY;
      lastX = dragEvent.clientX;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      this.setResizingStopped();

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

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  render() {
    const { previewWindow } = this.props.store.editor;

    return (
      <Draggable
        onStart={this.setResizingStarted}
        onStop={this.setResizingStopped}
        onDrag={this.handleDrag}
        position={{
          x: previewWindow.x,
          y: previewWindow.y,
        }}
      >
        <div
          style={{
            position: 'relative',
            boxSizing: 'border-box',
            overflow: 'hidden',
            borderRadius: '4px',
            width: previewWindow.width || '100%',
            flex: previewWindow.width
              ? `0 0 ${previewWindow.width}px`
              : undefined,
            height: previewWindow.height,
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.5)',
            zIndex: 60,
            cursor: 'move',
            margin: '1rem',
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
          {this.props.children}

          {this.state.resizing && (
            <ResizingNotice>
              {Math.floor(previewWindow.width)} x{' '}
              {Math.floor(previewWindow.height)}
            </ResizingNotice>
          )}
        </div>
      </Draggable>
    );
  }
}

export default inject('signals', 'store')(observer(FlyingContainer));
