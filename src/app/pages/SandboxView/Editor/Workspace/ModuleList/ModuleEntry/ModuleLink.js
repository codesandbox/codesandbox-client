// @flow
import React from 'react';
import styled from 'styled-components';
import { css } from 'glamor';
import { Link } from 'react-router';
import { DragSource, DropTarget } from 'react-dnd';

import commonStyles from './styles';
import type { Module } from '../../../../../../store/entities/modules/';
import ModuleIcons from './ModuleIcons';
import ModuleTitle from './ModuleTitle';
import ModuleActions from './ModuleActions';
import theme from '../../../../../../../common/theme';

const Container = styled.span`a {${props => commonStyles(props)}}`;

const DragOverlay = styled.div`
  position: absolute;

  top: 0; right: 0; left: 0; bottom: 0;

  background-color: rgba(0, 0, 0, 0.3);
`;

const activeClassName = css({
  color: `${theme.white()} !important`,
  borderColor: `${theme.primary()} !important`,
  backgroundColor: `${theme.background3()} !important`,
}).toString();

// Don't trust flow checks for this component'
type Props = {
  id: string;
  title: string;
  type: ?string;
  isTreeOpen: boolean;
  isNotSynced: ?boolean;
  url: string;
  depth: number;
  hasChildren: boolean;
  toggleOpen?: (event: Event) => void;
  onEditClick: (e: Event) => void;
  onCreateClick: (e: Event) => void;
  connectDragSource: Function;
  connectDropTarget: Function;
  isChildOfModule: (firstModuleId: string) => boolean;
  addChild: (id: string) => void;
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
      title, type, isTreeOpen, url, depth, hasChildren, connectDragSource, connectDropTarget,
      toggleOpen, onEditClick, onCreateClick, isNotSynced,
    } = this.props;
    const { dragAbove } = this.state;

    return connectDropTarget(connectDragSource(
      <div style={{ position: 'relative' }}>
        {dragAbove && <DragOverlay />}
        <Container depth={depth}>
          <Link activeOnlyWhenExact activeClassName={activeClassName} to={url}>
            <ModuleIcons
              type={type}
              hasChildren={hasChildren}
              isOpen={isTreeOpen}
              onOpen={toggleOpen}
              isNotSynced={isNotSynced}
            />
            <ModuleTitle title={title} />
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
  canDrag: props => !props.isMainModule,
  beginDrag: props => ({ id: props.id }),
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const moduleTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    const sourceItem = monitor.getItem();

    props.addChild(sourceItem.id);
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    if (source.id === props.id) return false;
    if (props.isChildOfModule(source.id)) return false;
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
