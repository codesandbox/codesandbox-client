// @ts-check
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import history from 'app/utils/history';
import { sandboxUrl } from 'common/utils/url-generator';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Spring } from 'react-spring';

import ContextMenu from 'app/components/ContextMenu';

import {
  Container,
  SandboxImageContainer,
  SandboxImage,
  SandboxInfo,
  SandboxDetails,
  ImageMessage,
} from './elements';

type Props = {
  id: string,
  title: string,
  details: string,
  selected: boolean,
  setSandboxesSelected: (ids: string[], additive?: boolean) => void,
};

export const PADDING = 32;

class SandboxItem extends React.Component<Props> {
  el: HTMLDivElement;

  componentDidMount() {
    if (this.props.selected) {
      if (this.el && typeof this.el.focus === 'function') {
        this.el.focus();
      }
    }

    const { connectDragPreview } = this.props;
    if (connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true,
      });
    }
  }

  handleMouseDown = e => {
    e.stopPropagation();

    if (!this.props.selected) {
      this.selectSandbox(e);
    }
  };

  selectSandbox = e => {
    this.props.setSandboxesSelected([this.props.id], {
      additive: e.metaKey,
      range: e.shiftKey,
    });
  };

  openSandbox = () => {
    // Git sandboxes aren't shown here anyway
    history.push(sandboxUrl({ id: this.props.id }));

    return true;
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // enter
      this.openSandbox();
    }
  };

  handleOnContextMenu = this.selectSandbox;
  handleOnFocus = e => {
    if (!this.props.selected) {
      this.selectSandbox(e);
    }
  };

  render() {
    const {
      style,
      id,
      title,
      details,
      connectDragSource,
      selected,
      isDraggingItem,
    } = this.props;

    return (
      <Spring to={style}>
        {newStyle => (
          <ContextMenu
            style={{
              ...newStyle,
              paddingRight: PADDING,
              boxSizing: 'border-box',
              opacity: isDraggingItem ? 0 : 1,
            }}
            id={id}
            className="sandbox-item"
            ref={el => {
              this.el = el;
            }}
            items={[
              {
                title: 'Open Sandbox',
                action: this.openSandbox,
              },
            ]}
          >
            {connectDragSource(
              <div>
                <Container
                  style={{ outline: 'none' }}
                  onMouseDown={this.handleMouseDown}
                  onContextMenu={this.handleOnContextMenu}
                  onDoubleClick={this.openSandbox}
                  onFocus={this.handleOnFocus}
                  onKeyDown={this.handleKeyDown}
                  role="button"
                  tabIndex={0}
                  selected={selected}
                >
                  <SandboxImageContainer>
                    <ImageMessage>Generating Screenshot...</ImageMessage>
                    <SandboxImage
                      style={{
                        backgroundImage: `url(${`/api/v1/sandboxes/${id}/screenshot.png`})`,
                      }}
                    />
                  </SandboxImageContainer>
                  <SandboxInfo>
                    <div>{title}</div>
                    <SandboxDetails>{details}</SandboxDetails>
                  </SandboxInfo>
                </Container>
              </div>
            )}
          </ContextMenu>
        )}
      </Spring>
    );
  }
}

/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag(props) {
    props.setDragging({ isDragging: true });

    return {
      left: props.style.left,
      top: props.style.top,
      id: props.id,
      collectionPath: props.collectionPath,
    };
  },

  endDrag(props) {
    props.setDragging({ isDragging: false });
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  };
}

export default DragSource('SANDBOX', cardSource, collect)(SandboxItem);
