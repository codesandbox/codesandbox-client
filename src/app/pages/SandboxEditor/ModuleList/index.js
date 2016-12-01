// @flow
import React from 'react';
import styled from 'styled-components';

import type { Module } from '../../../store/entities/modules';
import moduleEntity from '../../../store/entities/modules/';
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
  cancelEditModule: typeof moduleEntity.actions.cancelEditModule;
  commitEditModule: typeof moduleEntity.actions.commitEditModule;
  editModule: typeof moduleEntity.actions.editModule;
  createModule: typeof moduleEntity.actions.createModule;
  toggleTreeOpen: typeof moduleEntity.actions.toggleTreeOpen;
}

export default class SandboxModuleList extends React.Component {
  toggleOpen = (event: Event) => {
    event.preventDefault();

    this.props.toggleTreeOpen(this.props.module.id);
  };

  onEditClick = (e: Event) => {
    e.preventDefault();

    const { module, editModule } = this.props;
    editModule(module.id, { title: module.title });
  };

  onCreateClick = (e: Event) => {
    e.preventDefault();

    const { module, createModule, toggleTreeOpen } = this.props;
    if (!module.isTreeOpen) toggleTreeOpen(module.id);

    createModule(module.id);
  };

  onCancelEdit = () => {
    const { module, cancelEditModule } = this.props;

    cancelEditModule(module.id);
  }

  onCommitEdit = () => {
    const { module, commitEditModule } = this.props;

    commitEditModule(module.id);
  }

  onRenameChange = (name: string) => {
    const { module, editModule } = this.props;
    editModule(module.id, { title: name });
  }

  props: Props;

  render() {
    const { depth, modules, module, activeModuleId, url, commitEditModule,
      toggleTreeOpen, cancelEditModule, editModule, createModule } = this.props;
    const children = getModuleChildren(module, modules);
    const isActive = module.id === activeModuleId;
    return (
      <div>
        <div>
          {module.edits ? (
            <ModuleEdit
              depth={depth}
              module={module}
              isActive={isActive}
              onChange={this.onRenameChange}
              onCancel={this.onCancelEdit}
              onCommit={this.onCommitEdit}
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
              depth={depth}
            />
          )}
        </div>
        {children.length > 0 &&
          <Opener isOpen={module.isTreeOpen}>
            {children.map(childModule => (
              <SandboxModuleList
                key={childModule.id}
                depth={depth + 1}
                modules={modules}
                module={childModule}
                activeModuleId={activeModuleId}
                commitEditModule={commitEditModule}
                toggleTreeOpen={toggleTreeOpen}
                createModule={createModule}
                cancelEditModule={cancelEditModule}
                editModule={editModule}
                url={url}
              />
            ))}
          </Opener>}
      </div>
    );
  }
}
