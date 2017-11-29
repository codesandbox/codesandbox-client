// @flow
import React from 'react';
import styled from 'styled-components';

import type { Module } from 'common/types';

import Tab from './Tab';

const Container = styled.div`
  height: 2.5rem;
  flex: 0 0 2.5rem;
  color: rgba(255, 255, 255, 0.8);

  background-color: rgba(0, 0, 0, 0.3);

  overflow-x: auto;
`;

type Props = {
  setCurrentModule: (sandboxId: string, moduleId: string) => void,
  closeTab: (sandboxId: string, moduleId: string) => void,
  moveTab: (sandboxId: string, moduleId: string, position: number) => void,
  markNotDirty: (sandboxId: string) => void,
  tabs: Array<{ moduleId: string }>,
  modules: Array<Module>,
  currentModuleId: string,
  sandboxId: string,
};

export default class EditorTabs extends React.PureComponent<Props> {
  closeTab = (moduleId: string) => {
    this.props.closeTab(this.props.sandboxId, moduleId);
  };

  moveTab = (moduleId: string, position: number) => {
    this.props.moveTab(this.props.sandboxId, moduleId, position);
  };

  /**
   * Mark all tabs not dirty (not cursive)
   */
  markNotDirty = () => {
    this.props.markNotDirty(this.props.sandboxId);
  };

  setCurrentModule = (moduleId: string) => {
    this.props.setCurrentModule(this.props.sandboxId, moduleId);
  };

  render() {
    const { tabs, modules, currentModuleId } = this.props;
    const moduleObject = {};

    modules.forEach(m => {
      moduleObject[m.id] = m;
    });

    return (
      <Container>
        {tabs
          .map(tab => ({ ...tab, module: moduleObject[tab.moduleId] }))
          .map((tab, i) => (
            <Tab
              setCurrentModule={this.setCurrentModule}
              active={currentModuleId === tab.module.id}
              key={tab.module.id}
              module={tab.module}
              closeTab={this.closeTab}
              moveTab={this.moveTab}
              markNotDirty={this.markNotDirty}
              tabCount={tabs.length}
              position={i}
              dirty={tab.dirty}
            />
          ))}
      </Container>
    );
  }
}
