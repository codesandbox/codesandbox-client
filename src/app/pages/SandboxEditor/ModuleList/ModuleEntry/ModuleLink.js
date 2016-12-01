// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { DragSource, DropTarget } from 'react-dnd';

import commonStyles from './styles';
import type { Module } from '../../../../store/entities/modules/';
import ModuleIcons from './ModuleIcons';
import ModuleTitle from './ModuleTitle';
import ModuleActions from './ModuleActions';

const Container = styled.span`> a {${props => commonStyles(props)}}`;

const DragOverlay = styled.div`
  position: absolute;

  top: 0; right: 0; left: 0; bottom: 0;

  background-color: rgba(0, 0, 0, 0.3);
`;

type Props = {
  module: Module;
  url: (module: Module) => string;
  isActive: boolean;
  depth: number;
  hasChildren: boolean;
  toggleOpen?: (event: Event) => void;
  onEditClick: (e: Event) => void;
  onCreateClick: (e: Event) => void;
  connectDragSource: Function;
  connectDropTarget: Function;
  isChildOfModule: (firstModuleId: string, secondModuleId: string) => boolean;
};

type State = {
  dragAbove: boolean;
};

class ModuleEntry extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      dragAbove: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver && nextProps.canDrop) {
      this.setState({ dragAbove: true });
    }

    if (this.props.isOver && !nextProps.isOver) {
      this.setState({ dragAbove: false });
    }
  }

  props: Props;
  state: State;
  render() {
    const {
      module, url, isActive, depth, hasChildren, connectDragSource, connectDropTarget,
      toggleOpen, onEditClick, onCreateClick,
    } = this.props;
    const { dragAbove } = this.state;

    return connectDropTarget(connectDragSource(
      <div style={{ position: 'relative' }}>
        {dragAbove && <DragOverlay />}
        <Container active={isActive} depth={depth}>
          <Link to={url(module)}>
            <ModuleIcons
              type={module.type}
              hasChildren={hasChildren}
              isOpen={module.isTreeOpen}
              onOpen={toggleOpen}
            />
            <ModuleTitle title={module.title} />
            <ModuleActions
              onEditClick={onEditClick}
              onCreateClick={onCreateClick}
            />
          </Link>
        </Container>
      </div>));
  }
}

const moduleSource = {
  canDrag: props => props.module.parentModuleId != null,
  beginDrag: props => ({ id: props.module.id }),
  endDrag: (props, monitor, component) => {
    if (!monitor.didDrop()) return;

    console.log('Hoi');
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const moduleTarget = {
  drop: () => {
    console.log('hey');
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    if (source.id === props.module.id) return false;
    if (props.isChildOfModule(source.id, props.module.id)) return false;
    return true;
  },
};

function collectTarget(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

const Source = DragSource('MODULE', moduleSource, collectSource)(ModuleEntry);

export default DropTarget('MODULE', moduleTarget, collectTarget)(Source);
