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

const getModuleStyles = (props) => {
  const getBackgroundColor = (isHovering = false) => {
    if (props.editing) return theme.background3.darken(0.3)();
    if (props.active) return theme.background3();
    if (isHovering) return props.theme.background3.darken(0.2)();
    return 'initial';
  };

  const getColor = () => {
    if (props.editing) return props.theme.background.lighten(5)();
    return props.theme.background.lighten(2)();
  };

  const getBorderColor = () => {
    if (props.editing) return theme.primary();
    return 'transparent';
  };

  return `
    transition: 0.3s ease all;
    position: relative;
    display: block;
    font-size: 14px;
    padding: 0.6rem;
    padding-left: ${props.depth + 2.9}rem;
    color: ${getColor()};
    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;
    background-color: ${getBackgroundColor()};
    border-color: ${getBorderColor()};

    ${props.active ? `
      color: #E0E0E0;

      border-color: ${theme.primary()};
    ` : `
      &:hover {
        background-color: ${getBackgroundColor(true)};
        color: ${props.theme.background.lighten(5)()};
        border-color: ${props.theme.primary.darken(0.4)()};
      }
    `}
  `;
};

const ModuleLink = styled(Link)`${props => getModuleStyles(props)}`;
const ModuleSpan = styled.span`${props => getModuleStyles(props)}`;

const StyledFolderIcon = styled(FolderIcon)`
  transition: 0.3s ease transform;
  margin-left: -16px;
  margin-right: 8px;

  transform: rotateZ(${props => (props.isOpen ? '0deg' : '-90deg')});
`;

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
  };

  getLink = () => {
    if (this.state.editing) {
      return ModuleSpan;
    }

    return ModuleLink;
  }

  props: Props;
  state: State;
  render() {
    const { module, url, isActive, hasChildren, isOpen, depth,
      toggleOpen } = this.props;
    const { editing } = this.state;

    const ModuleContainer = this.getLink();
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
        <ModuleContainer
          to={url(module)}
          active={isActive}
          depth={depth}
          editing={editing}
        >
          {hasChildren && <StyledFolderIcon isOpen={isOpen} onClick={toggleOpen} />}
          <ModuleIcon type={module.type} />
          <ModuleTitle
            title={module.title}
            editable={editing}
            onEditCommit={this.handleRename}
            cancelEdit={this.stopEditing}
          />
        </ModuleContainer>
      </div>
    );
  }
}
