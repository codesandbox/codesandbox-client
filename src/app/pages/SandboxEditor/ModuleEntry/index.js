// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import FolderIcon from 'react-icons/lib/md/keyboard-arrow-down';

import type { Module } from '../../../store/entities/modules/';
import ModuleIcon from './ModuleIcon';
import ModuleTitle from './ModuleTitle';
import ModuleTitleInput from './ModuleTitleInput';
import Actions from './Actions';
import theme from '../../../../common/theme';

const commonStyles = (props) => {
  let styles = `
    transition: 0.3s ease all;
    position: relative;
    display: block;
    font-size: 14px;
    padding: 0.6rem;
    padding-left: ${props.depth + 2.9}rem;
    color: ${props.theme.background.lighten(2)()};
    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;
  `;

  if (props.active) {
    styles += `
      color: ${theme.white()};
      border-color: ${theme.primary()};
      background-color: ${theme.background3()};
    `;
  } else if (!props.editing) {
    styles += `
      &:hover {
        background-color: ${theme.background3.darken(0.2)()};
        color: ${theme.background.lighten(5)()};
        border-color: ${theme.primary.darken(0.4)()};
      }
    `;
  }

  if (props.editing) {
    styles += `
      color: ${theme.white()}
    `;

    if (props.nameValidationError) {
      styles += `
        border-color: ${theme.red()}
        background-color: ${theme.redBackground.clearer(0.4)()}
      `;
    }
  }

  return styles;
};

const ModuleLink = styled(Link)`${props => commonStyles(props)}`;
const ModuleSpan = styled.span`${props => commonStyles(props)}`;

const StyledFolderIcon = styled(FolderIcon)`
  transition: 0.3s ease transform;
  margin-left: -16px;
  margin-right: 8px;

  transform: rotateZ(${props => (props.isOpen ? '0deg' : '-90deg')});
`;

type Props = {
  module: Module;
  modules: Array<Module>;
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
  newModuleName: string;
  nameValidationError: ?string;
};

export default class ModuleEntry extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      hovering: false,
      editing: false,
      newModuleName: props.module ? props.module.title : '',
      nameValidationError: null,
    };
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  };

  startEditing = () => {
    const { title } = this.props.module;
    this.setState({ editing: true, newModuleName: title, nameValidationError: null });
  };

  stopEditing = () => {
    const { title } = this.props.module;
    this.setState({ editing: false, newModuleName: title, nameValidationError: null });
  };

  handleNameChange = (name: string) => {
    const error = this.getNameErrorMessage(name);
    this.setState({ newModuleName: name, nameValidationError: error });
  }

  handleRenameCommit = (force = false) => {
    const { newModuleName: name, nameValidationError } = this.state;
    if (this.props.module.title !== name && nameValidationError == null) {
      this.props.updateModule(this.props.module.id, { title: this.props.module.title }, {
        title: name,
      });

      this.stopEditing();
    } else if (force) {
      this.stopEditing();
    }
  };

  getNameErrorMessage = (name: string) => {
    const { module, modules } = this.props;

    if (!/^[0-9a-zA-Z]+$/.test(name)) {
      // It has whitespaces
      return 'Title cannot have whitespaces or special characters';
    }

    if (module.parentModuleId) {
      // Check if there are other modules with the same name
      const parentModule = modules.find(m => m.id === module.parentModuleId);
      if (parentModule != null) {
        const siblingNames: Array<string> = parentModule.children
                                .map(id => modules.find(m => m.id === id))
                                .filter(x => x != null)
                                .filter(m => m.id !== module.id)
                                .map(m => m.title);
        if (siblingNames.indexOf(name) > -1) {
          return 'There is already a module with the same name in this scope';
        }
      }
    }

    if (name.length > 32) {
      return "The name can't be more than 32 characters long";
    }

    return null;
  }

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
    const { editing, newModuleName, nameValidationError } = this.state;

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
          nameValidationError={nameValidationError}
        >
          {hasChildren && <StyledFolderIcon isOpen={isOpen} onClick={toggleOpen} />}
          <ModuleIcon type={module.type} />
          {editing ? (
            <ModuleTitleInput
              title={newModuleName}
              onChange={this.handleNameChange}
              onCommit={this.handleRenameCommit}
              cancelEdit={this.stopEditing}
              getNameErrorMessage={this.getNameErrorMessage}
            />
          ) : (
            <ModuleTitle title={module.title} />
          )}

        </ModuleContainer>
      </div>
    );
  }
}
