// @flow
import React from 'react';
import styled from 'styled-components';

import { sortBy } from 'lodash';
import type { Module } from '../../store/entities/modules/';

import ModuleEntry from './ModuleEntry/';

const Opener = styled.div`
  height: ${props => (props.isOpen ? 'auto' : 0)};
`;

type Props = {
  module: Module;
  modules: Array<Module>;
  activeModuleId: string;
  url: (module: Module) => string;
  depth: number;
  updateModule: (id: string, module: Module) => void;
}

type State = {
  isOpen: boolean;
};

export default class SandboxModuleList extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: true,
    };
  }

  toggleOpen = (event: Event) => {
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  props: Props;
  state: State;

  render() {
    const { depth, modules, module, activeModuleId, updateModule, url } = this.props;
    const children = module.children.map(id => modules.find(m => m.id === id));
    return (
      <div>
        <ModuleEntry
          module={module}
          modules={modules}
          url={url}
          isActive={module.id === activeModuleId}
          hasChildren={module.children.length > 0}
          isOpen={this.state.isOpen}
          toggleOpen={this.toggleOpen}
          updateModule={updateModule}
          depth={depth}
        />
        {module.children.length > 0 &&
          <Opener isOpen={this.state.isOpen}>
            {sortBy(children.filter(x => x != null), m => m.title.toUpperCase()).map(childModule => (
              <SandboxModuleList
                key={childModule.id}
                depth={depth + 1}
                modules={modules}
                module={childModule}
                activeModuleId={activeModuleId}
                updateModule={updateModule}
                url={url}
              />
            ))}
          </Opener>}
      </div>
    );
  }
}
