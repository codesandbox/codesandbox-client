// @flow
import React from 'react';
import styled from 'styled-components';

import type { Module, Directory } from 'common/types';

import Tab from './TabContainer';

const Container = styled.div`
  display: flex;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  color: rgba(255, 255, 255, 0.8);

  background-color: rgba(0, 0, 0, 0.3);

  overflow-x: auto;
  overflow-y: hidden;

  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 2px;
  }
`;

type Props = {
  setCurrentModule: (sandboxId: string, moduleId: string) => void,
  closeTab: (sandboxId: string, moduleId: string) => void,
  moveTab: (sandboxId: string, moduleId: string, position: number) => void,
  markNotDirty: (sandboxId: string) => void,
  tabs: Array<{ moduleId: string }>,
  modules: Array<Module>,
  directories: Array<Directory>,
  currentModuleId: string,
  sandboxId: string,
};

export default class EditorTabs extends React.PureComponent<Props> {
  componentWillMount() {
    window.addEventListener('keydown', this.closeListener);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeListener);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.currentModuleId !== prevProps.currentModuleId) {
      // We need to scroll to the tab
      if (this.tabEls[this.props.currentModuleId]) {
        const { width } = this.container.getBoundingClientRect();
        const scroll = this.container.scrollLeft;
        const { left } = this.tabEls[
          this.props.currentModuleId
        ].getBoundingClientRect();

        if (left > scroll && left < scroll + width) {
          // if it's already in view
          return;
        }

        this.tabEls[this.props.currentModuleId].scrollIntoView(false);
      }
    }
  }

  closeListener = e => {
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyW') {
      e.preventDefault();
      const currentPos = this.props.tabs.findIndex(
        t => t.moduleId === this.props.currentModuleId
      );
      this.closeTab(currentPos);
    }
  };

  closeTab = (position: number) => {
    this.props.closeTab(this.props.sandboxId, position);
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

  container: HTMLElement;
  tabEls = {};
  tabEls: {
    [moduleId: string]: HTMLElement,
  };

  render() {
    const { tabs, modules, directories, currentModuleId } = this.props;
    const moduleObject = {};
    // We keep this object to keep track if there are duplicate titles.
    // In that case we need to show which directory the module is in.
    const tabNamesObject = {};

    modules.forEach(m => {
      moduleObject[m.id] = m;
    });

    tabs.forEach(tab => {
      const module = moduleObject[tab.moduleId];

      tabNamesObject[module.title] = tabNamesObject[module.title] || [];
      tabNamesObject[module.title].push(module.id);
    });

    return (
      <Container
        innerRef={el => {
          this.container = el;
        }}
      >
        {tabs
          .map(tab => ({ ...tab, module: moduleObject[tab.moduleId] }))
          .map((tab, i) => {
            const { module } = tab;
            const modulesWithName = tabNamesObject[module.title];
            let dirName = null;

            if (modulesWithName.length > 1 && module.directoryShortid != null) {
              const dir = directories.find(
                d =>
                  d.shortid === module.directoryShortid &&
                  d.sourceId === module.sourceId
              );

              if (dir) {
                dirName = dir.title;
              }
            }

            return (
              <Tab
                setCurrentModule={this.setCurrentModule}
                active={currentModuleId === tab.module.id}
                key={tab.module.id}
                module={tab.module}
                closeTab={this.closeTab}
                moveTab={this.moveTab}
                markNotDirty={this.markNotDirty}
                dirName={dirName}
                tabCount={tabs.length}
                position={i}
                dirty={tab.dirty}
                innerRef={el => {
                  this.tabEls[tab.module.id] = el;
                }}
              />
            );
          })}
      </Container>
    );
  }
}
