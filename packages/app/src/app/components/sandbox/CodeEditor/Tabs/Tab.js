// @flow
import React from 'react';
import styled, { css } from 'styled-components';
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
`;

const TabTitle = styled.div`
  padding-right: 1rem;
`;

const StyledCloseIcon = styled(CloseIcon)`
  transition: 0.1s ease opacity;
  position: absolute;
  right: 0.125rem;
  opacity: 1;
  color: white;

  ${props =>
    !props.show &&
    css`
      pointer-events: none;
      opacity: 0;
    `};
`;

type Props = {
  module: Module,
  active: boolean,
  setCurrentModule: (moduleId: string) => void,
  closeTab: (moduleId: string) => void,
  moveTab: (moduleId: string, position: number) => void,
  tabCount: number,

  // Injected by React DnD:
  isDragging: boolean,
  connectDragSource: Function,

  position: number,
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
    this.props.closeTab(this.props.module.id);
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
    } = this.props;
    const { hovering } = this.state;

    return connectDropTarget(
      connectDragSource(
        <span>
          <Container
            active={active}
            isOver={isOver}
            onClick={this.setCurrentModule}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <EntryIcons
              isNotSynced={module.isNotSynced}
              type={getType(module)}
              error={module.errors && module.errors.length > 0}
            />
            <TabTitle>{module.title}</TabTitle>
            <StyledCloseIcon
              onClick={this.closeTab}
              show={tabCount !== 1 && (active || hovering)}
            />
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

    props.moveTab(sourceItem.id, props.position);
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    return true;
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
    return { id: props.module.id, position: props.position };
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DropTarget('TAB', entryTarget, collectTarget)(
  DragSource('TAB', entrySource, collectSource)(Tab)
);
