// @flow
import React from 'react';
import styled from 'styled-components';

import type { Module } from '../../../store/entities/modules';
import moduleEntity from '../../../store/entities/modules/';
import { validateTitle, isChildOfModule } from '../../../store/entities/modules/validator';
import { getModuleChildren } from '../../../store/entities/modules/selector';

import ModuleLink from './ModuleEntry/ModuleLink';
import ModuleEdit from './ModuleEntry/ModuleEdit';

const Opener = styled.div`
  height: ${props => (props.isOpen ? 'auto' : 0)};
  overflow: hidden; /* Don't show other modules through */
`;

type Props = {
  module: Module;
  modules: Array<Module>;
  activeModuleId: string;
  url: (module: Module) => string;
  depth: number;
  createModule: typeof moduleEntity.actions.createModule;
  renameModule: typeof moduleEntity.actions.renameModule;
  toggleTreeOpen: typeof moduleEntity.actions.toggleTreeOpen;
  addChild: typeof moduleEntity.actions.addChild;
};

type State = {
  state: '' | 'editing' | 'creating'
}

export default class ModuleList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      state: '',
    };
  }

  toggleOpen = (event: Event) => {
    event.preventDefault();

    this.props.toggleTreeOpen(this.props.module.id);
  };

  onEditClick = (e: Event) => {
    e.preventDefault();

    this.setState({ state: 'editing' });
  };

  onCreateClick = (e: Event) => {
    e.preventDefault();

    const { module, toggleTreeOpen } = this.props;
    if (!module.isTreeOpen) toggleTreeOpen(module.id);

    this.setState({ state: 'creating' });
  };

  resetState = () => {
    this.setState({ state: '' });
  }

  handleValidateTitle = (title: string, module: Module, parentModule: Module) => {
    const { modules } = this.props;
    return validateTitle(title, module, parentModule, modules);
  };

  handleRenameValidation = (title: string) => {
    const { module, modules } = this.props;
    const parentModule = modules.find(m => m.id === module.parentModuleId);
    return this.handleValidateTitle(title, module, parentModule);
  };

  handleCreationValidation = (title: string) => {
    const parentModule = this.props.module;
    return this.handleValidateTitle(title, {}, parentModule);
  };

  handleRename = (title: string, force?: boolean) => {
    const { module } = this.props;
    const isInvalidTitle = this.handleRenameValidation(title);

    if (isInvalidTitle && force) {
      this.resetState();
    } else if (!isInvalidTitle) {
      this.props.renameModule(module.id, title);
      this.resetState();
    }
  };

  handleCreate = (title: string, force?: boolean) => {
    const isInvalidTitle = this.handleCreationValidation(title);

    if (isInvalidTitle && force) {
      this.resetState();
    } else if (!isInvalidTitle) {
      const { module } = this.props;
      this.props.createModule(module.id, title);
      this.resetState();
    }
  };

  addChild = (childId: string) => {
    const { module, addChild } = this.props;

    addChild(module.id, childId);
  }

  isChildOfModule = (firstModuleId: string, secondModuleId: string) => {
    const { modules } = this.props;
    return isChildOfModule(firstModuleId, secondModuleId, modules);
  };

  props: Props;
  state: State;

  render() {
    const { depth, modules, addChild, module, activeModuleId, url,
      toggleTreeOpen, renameModule, createModule } = this.props;
    const { state } = this.state;
    const children = getModuleChildren(module, modules);
    const isActive = module.id === activeModuleId;
    return (
      <div>
        <div>
          {state === 'editing' ? (
            <ModuleEdit
              depth={depth}
              title={module.title}
              type={module.type}
              isActive={isActive}
              validateTitle={this.handleRenameValidation}
              onCancel={this.resetState}
              onCommit={this.handleRename}
            />
          ) : (
            <ModuleLink
              module={module}
              url={url}
              hasChildren={children.length > 0}
              isActive={isActive}
              toggleOpen={this.toggleOpen}
              onEditClick={this.onEditClick}
              onCreateClick={this.onCreateClick}
              addChild={this.addChild}
              depth={depth}
              isChildOfModule={this.isChildOfModule}
            />
          )}
        </div>
        {(children.length > 0 || state === 'creating') &&
          <Opener isOpen={module.isTreeOpen}>
            {state === 'creating' && (
              <ModuleEdit
                depth={depth + 1}
                title=""
                type=""
                isActive={false}
                validateTitle={this.handleCreationValidation}
                onCancel={this.resetState}
                onCommit={this.handleCreate}
              />
            )}
            {children.map(childModule => (
              <ModuleList
                key={childModule.id}
                depth={depth + 1}
                modules={modules}
                module={childModule}
                activeModuleId={activeModuleId}
                toggleTreeOpen={toggleTreeOpen}
                createModule={createModule}
                renameModule={renameModule}
                addChild={addChild}
                url={url}
              />
            ))}
          </Opener>}
      </div>
    );
  }
}
