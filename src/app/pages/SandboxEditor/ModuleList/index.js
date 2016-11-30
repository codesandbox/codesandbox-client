// @flow
import React from 'react';
import styled from 'styled-components';

import { sortBy } from 'lodash';
import type { Module } from '../../../store/entities/modules';
import moduleEntity from '../../../store/entities/modules/';

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
      toggleTreeOpen, cancelEditModule, editModule } = this.props;
    const children = module.children
      .map(id => modules.find(m => m.id === id))
      .filter(x => x != null);
    const sortedChildren = sortBy(children, m => m.title.toUpperCase());
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
              isActive={isActive}
              toggleOpen={this.toggleOpen}
              onEditClick={this.onEditClick}
              onCreateClick={this.onCreateClick}
              depth={depth}
            />
          )}
        </div>
        {module.children.length > 0 &&
          <Opener isOpen={module.isTreeOpen}>
            {sortedChildren.map(childModule => (
              <SandboxModuleList
                key={childModule.id}
                depth={depth + 1}
                modules={modules}
                module={childModule}
                activeModuleId={activeModuleId}
                commitEditModule={commitEditModule}
                toggleTreeOpen={toggleTreeOpen}
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
