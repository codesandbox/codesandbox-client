// @ts-check
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import history from 'app/utils/history';
import { sandboxUrl } from 'common/utils/url-generator';
import TrashIcon from 'react-icons/lib/md/delete';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import ContextMenu from 'app/components/ContextMenu';
import getTemplate from 'common/templates';
import theme from 'common/theme';

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
  deleteSandboxes: () => void,
  collectionPath: string, // eslint-disable-line react/no-unused-prop-types
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

  getContextItems = () => {
    if (this.props.removedAt) {
      return [
        {
          title: 'Delete Permanently',
          action: this.deletePermanently,
          icon: TrashIcon,
          color: theme.red.darken(0.2)(),
        },
      ];
    }

    const { selectedCount } = this.props;
    if (this.props.selectedCount > 1) {
      return [
        {
          title: `Move ${selectedCount} sandboxes to Trash`,
          action: () => {
            this.props.deleteSandboxes();
            return true;
          },
          icon: TrashIcon,
          color: theme.red.darken(0.2)(),
        },
      ];
    }

    return [
      {
        title: 'Open Sandbox',
        action: this.openSandbox,
      },
      {
        title: 'Open Sandbox in new tab',
        action: () => {
          this.openSandbox(true);
          return true;
        },
      },
      {
        title: `Move to Trash`,
        action: () => {
          this.props.deleteSandboxes();
          return true;
        },
        icon: TrashIcon,
        color: theme.red.darken(0.2)(),
      },
    ];
  };

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

  openSandbox = (openNewWindow = false) => {
    // Git sandboxes aren't shown here anyway
    const url = sandboxUrl({ id: this.props.id });
    if (!this.props.removedAt) {
      if (openNewWindow) {
        window.open(url, '_blank');
      } else {
        history.push(url);
      }
    }

    return true;
  };

  deletePermanently = () => {};

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // enter
      this.openSandbox();
    }
  };

  handleOnContextMenu = e => {
    if (!this.props.selected) {
      this.selectSandbox(e);
    }
  };
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
      template,
      connectDragSource,
      selected,
      isDraggingItem,
    } = this.props;

    const templateInfo = getTemplate(template);

    return (
      <ContextMenu
        style={{
          ...style,
          paddingRight: PADDING,
          boxSizing: 'border-box',
          opacity: isDraggingItem ? 0 : 1,
        }}
        id={id}
        className="sandbox-item"
        ref={el => {
          this.el = el;
        }}
        items={this.getContextItems()}
      >
        {connectDragSource(
          <div
            style={{
              padding: 2,
              borderRadius: 2,
              backgroundColor: selected ? theme.secondary() : 'transparent',
            }}
          >
            <Container
              style={{ outline: 'none' }}
              onMouseDown={this.handleMouseDown}
              onContextMenu={this.handleOnContextMenu}
              onDoubleClick={this.openSandbox}
              onFocus={this.handleOnFocus}
              onKeyDown={this.handleKeyDown}
              role="button"
              tabIndex={0}
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
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 2,
                    height: '100%',
                    backgroundColor: templateInfo.color(),
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div>{title}</div>
                  <SandboxDetails>{details}</SandboxDetails>
                </div>
              </SandboxInfo>
            </Container>
          </div>
        )}
      </ContextMenu>
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
      removedAt: props.removedAt,
    };
  },

  endDrag(props, monitor) {
    props.setDragging({ isDragging: false });

    const result = monitor.getDropResult();

    if (result && result.delete) {
      props.deleteSandboxes();
    }
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
  };
}

export default DragSource('SANDBOX', cardSource, collect)(SandboxItem);
