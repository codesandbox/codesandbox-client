// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';

import commonStyles from './styles';
import type { Module } from '../../../../store/entities/modules/';
import ModuleIcons from './ModuleIcons';
import ModuleTitle from './ModuleTitle';
import ModuleActions from './ModuleActions';

const Container = styled.span`> a { ${props => commonStyles(props)} }`;

type Props = {
  module: Module;
  url: (module: Module) => string;
  isActive: boolean;
  depth: number;
  hasChildren: boolean;
  toggleOpen?: (event: Event) => void;
  onEditClick: (e: Event) => void;
  onCreateClick: (e: Event) => void;
};

const ModuleEntry = ({
  module, url, isActive, depth, hasChildren, connectDragSource,
  toggleOpen, onEditClick, onCreateClick }: Props,
) => connectDragSource(
  <div>
    <Container
      active={isActive}
      depth={depth}
    >
      <Link to={url(module)} >
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
  </div>,
);

const moduleSource = {
  beginDrag: props => ({ id: props.module.id }),
  endDrag: (props, monitor, component) => {
    if (!monitor.didDrop()) return;

    console.log('Hoi');
  },
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource('MODULE', moduleSource, collect)(ModuleEntry);
