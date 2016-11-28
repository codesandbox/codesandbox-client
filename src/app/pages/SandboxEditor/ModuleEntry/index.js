// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import FolderIcon from 'react-icons/lib/md/keyboard-arrow-down';

import type { Module } from '../../../store/entities/modules/';
import ModuleIcon from './ModuleIcon';
import ModuleTitle from './ModuleTitle';
import Actions from './Actions';
import theme from '../../../../common/theme';

const ModuleLink = styled(Link)`
  transition: 0.3s ease all;
  position: relative;
  display: block;
  font-size: 14px;
  padding: 0.6rem;
  padding-left: ${props => props.depth + 2.9}rem;
  color: ${props => props.theme.background.lighten(2)};
  text-decoration: none;
  font-weight: 400;
  min-width: 100px;
  border-left: 2px solid transparent;

  &:hover {
    background-color: ${props => props.theme.background3.darken(0.2)};
    color: ${props => props.theme.background.lighten(5)};
    border-color: ${props => props.theme.primary.darken(0.4)};
  }
`;

const StyledFolderIcon = styled(FolderIcon)`
  transition: 0.3s ease transform;
  margin-left: -16px;
  margin-right: 8px;

  transform: rotateZ(${props => (props.isOpen ? '0deg' : '-90deg')});
`;

const activeStyle = {
  color: '#E0E0E0',

  borderColor: theme.primary(),
  backgroundColor: theme.background3(),
};

type Props = {
  module: Module;
  url: (module: Module) => string;
  isActive: boolean;
  hasChildren?: boolean;
  depth: number;
  toggleOpen?: (event: Event) => void;
  isOpen?: boolean;
  updateModule: (id: string, module: Module) => void;
};

type State = {
  hovering: boolean;
  editing: boolean;
};

export default class ModuleEntry extends React.Component {
  constructor() {
    super();
    this.state = {
      hovering: false,
      editing: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  };

  startEditing = () => {
    this.setState({ editing: true });
  };

  stopEditing = () => {
    this.setState({ editing: false });
  };

  handleRename = (name: string) => {
    if (this.props.module.title !== name) {
      this.props.updateModule(this.props.module.id, { title: this.props.module.title }, {
        title: name,
      });
    }

    this.stopEditing();
  }

  props: Props;
  state: State;
  render() {
    const { module, url, isActive, hasChildren, isOpen, depth,
      toggleOpen } = this.props;
    const { editing } = this.state;
    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{ position: 'relative' }}
      >
        {!this.state.editing &&
          <Actions
            show={this.state.hovering}
            startEditing={this.startEditing}
          />}
        <ModuleLink
          to={url(module)}
          isActive={() => isActive}
          activeStyle={activeStyle}
          depth={depth}
        >
          {hasChildren && <StyledFolderIcon isOpen={isOpen} onClick={toggleOpen} />}
          <ModuleIcon type={module.type} />
          <ModuleTitle
            title={module.title}
            editable={editing}
            onEditCommit={this.handleRename}
            cancelEdit={this.stopEditing}
          />
        </ModuleLink>
      </div>
    );
  }
}
