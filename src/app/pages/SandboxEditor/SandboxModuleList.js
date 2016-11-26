// @flow
import React from 'react';
import styled from 'styled-components';

import type { Sandbox } from '../../store/entities/sandboxes/';
import type { Module } from '../../store/entities/modules/';

import ModuleEntry from './ModuleEntry/';

const Opener = styled.div`
  overflow: hidden;
  height: ${props => (props.isOpen ? 'auto' : 0)};
`;

type Props = {
  sandbox: Sandbox;
  modules: { [id: string]: Module };
  sandboxes: { [id: string]: Sandbox };
  activeModuleId: string;
  url: (module: Module) => string;
  depth: number;
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
    const { depth, sandbox, sandboxes, modules, activeModuleId, url } = this.props;
    return (
      <div>
        <ModuleEntry
          module={modules[sandbox.mainModule]}
          url={url}
          isActive={modules[sandbox.mainModule].id === activeModuleId}
          title={sandbox.title}
          isProject
          isOpen={this.state.isOpen}
          toggleOpen={this.toggleOpen}
          depth={depth}
        />

        <Opener isOpen={this.state.isOpen}>
          {sandbox.modules.map((moduleId) => {
            const module = modules[moduleId];
            return (
              <ModuleEntry
                module={module}
                url={url}
                isActive={module.id === activeModuleId}
                title={module.name}
                depth={depth + 1}
              />
            );
          })}
          {depth === 0 && sandbox.sandboxes.map(sandboxId => (
            <SandboxModuleList
              key={sandboxId}
              sandbox={sandboxes[sandboxId]}
              modules={modules}
              activeModuleId={activeModuleId}
              url={url}
              depth={1}
            />
          ))}
        </Opener>
      </div>
    );
  }
}
