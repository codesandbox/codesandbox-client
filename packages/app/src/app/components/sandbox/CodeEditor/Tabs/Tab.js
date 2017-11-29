// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';

import type { Module } from 'common/types';

import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/store/entities/sandboxes/modules/utils/get-type';

import { DragSource, DropTarget } from 'react-dnd';

import CloseIcon from 'react-icons/lib/go/x';

const Container = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: calc(100% - 1px);
  font-size: 0.875rem;
  cursor: pointer;

  border-bottom: 1px solid transparent;

  padding: 0 1rem;
  padding-left: 0.75rem;
  color: rgba(255, 255, 255, 0.5);

  svg {
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  ${props =>
    props.isOver &&
    css`
      background-color: ${props.theme.background2.lighten(0.2)};
    `};
  ${props =>
    props.active &&
    css`
      background-color: ${props.theme.background2};
      border-color: ${props.theme.secondary};
      color: white;
    `};
  ${props =>
    props.dirty &&
    css`
      font-style: italic;
    `};
`;

const TabTitle = styled.div`
  padding-right: 1rem;
`;

const StyledCloseIcon = styled(CloseIcon)`
  transition: 0.1s ease opacity;
  position: absolute;
  right: 0.125rem;
  opacity: 1;
  color: rgba(255, 255, 255, 0.9);
  margin-right: 0;

  ${props =>
    !props.show &&
    css`
      pointer-events: none;
      opacity: 0;
    `};
`;
const StyledNotSyncedIcon = StyledCloseIcon.withComponent(NotSyncedIcon);

type Props = {
  module: Module,
  active: boolean,
  setCurrentModule: (moduleId: string) => void,
  closeTab: (position: number) => void,
  moveTab: (oldPosition: number, position: number) => void,
  markNotDirty: () => void,
  tabCount: number,

  // Injected by React DnD:
  isDragging: boolean,
  isOver: boolean,
  connectDragSource: Function,
  connectDropTarget: Function,

  position: number,
  dirty: boolean,
};

type State = {
  hovering: boolean,
};

class Tab extends React.PureComponent<Props, State> {
  state = {
    hovering: false,
  };

  setCurrentModule = () => {
    this.props.setCurrentModule(this.props.module.id);
  };

  closeTab = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.closeTab(this.props.position);
  };

  handleMouseEnter = () => {
    this.setState({
      hovering: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hovering: false,
    });
  };

  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isOver,
      module,
      active,
      tabCount,
      isDragging,
      dirty,
    } = this.props;
    const { hovering } = this.state;

    return connectDropTarget(
      connectDragSource(
        <span style={{ opacity: isDragging ? 0.5 : 1 }}>
          <Container
            active={active}
            dirty={dirty}
            isOver={isOver}
            onClick={this.setCurrentModule}
            onDoubleClick={this.props.markNotDirty}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <EntryIcons
              isNotSynced={module.isNotSynced}
              type={getType(module)}
              error={module.errors && module.errors.length > 0}
            />
            <TabTitle>{module.title}</TabTitle>
            {module.isNotSynced ? (
              <StyledNotSyncedIcon
                onClick={tabCount > 1 ? this.closeTab : null}
                show
              />
            ) : (
              <StyledCloseIcon
                onClick={this.closeTab}
                show={tabCount > 1 && (active || hovering) ? true : undefined}
              />
            )}
          </Container>
        </span>
      )
    );
  }
}

const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();

    if (sourceItem == null) {
      return;
    }

    props.moveTab(sourceItem.position, props.position);
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return props.position !== source.position;
  },
};

function collectTarget(connectMonitor, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

const entrySource = {
  canDrag: () => true,
  beginDrag: (props: Props) => {
    return { position: props.position };
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DropTarget('TAB', entryTarget, collectTarget)(
  DragSource('TAB', entrySource, collectSource)(Tab)
);
