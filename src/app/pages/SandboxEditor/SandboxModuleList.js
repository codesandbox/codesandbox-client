// @flow
import React from 'react';
import styled from 'styled-components';

import type { Module } from '../../store/entities/modules/';

import ModuleEntry from './ModuleEntry/';

const Opener = styled.div`
  overflow: hidden;
  height: ${props => (props.isOpen ? 'auto' : 0)};
`;

type Props = {
  module: Module;
  modules: Array<Module>;
  activeModuleId: string;
  url: (module: Module) => string;
  depth: number;
  title?: string;
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
    const { depth, modules, module, title, activeModuleId, url } = this.props;
    return (
      <div>
        <ModuleEntry
          module={module}
          url={url}
          isActive={module.id === activeModuleId}
          title={title || module.title}
          isProject={module.children.length > 0}
          isOpen={this.state.isOpen}
          toggleOpen={this.toggleOpen}
          depth={depth}
        />
        {module.children.length > 0 &&
          <Opener isOpen={this.state.isOpen}>
            {module.children.map((moduleId) => {
              const childModule = modules.find(m => m.id === moduleId);

              return (
                <SandboxModuleList
                  key={moduleId}
                  depth={depth + 1}
                  modules={modules}
                  module={childModule}
                  activeModuleId={activeModuleId}
                  url={url}
                />
              );
            })}
          </Opener>}
      </div>
    );
  }
}
