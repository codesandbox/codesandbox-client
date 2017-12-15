// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import PrettierIcon from 'react-icons/lib/md/brush';

import type { Module, Directory } from 'common/types';
import Tooltip from 'common/components/Tooltip';

import { canPrettify } from 'app/store/entities/sandboxes/modules/utils/prettify';

import Tab from './TabContainer';

const Container = styled.div`
  display: flex;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  color: rgba(255, 255, 255, 0.8);

  background-color: rgba(0, 0, 0, 0.3);
`;

const TabsContainer = styled.div`
  display: flex;
  height: 2.5rem;
  flex: 1 0 2.5rem;

  overflow-x: auto;
  overflow-y: hidden;

  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    height: 2px;
  }
`;

const StyledPrettierIcon = styled(PrettierIcon)`
  transition: 0.3s ease opacity;
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;

  opacity: 0.6;

  &:hover {
    opacity: 1;
  }

  ${props =>
    props.disabled &&
    css`
      opacity: 0;
      pointer-events: none;
    `};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  float: right;
  flex-shrink: 1;
  padding: 0 0.75rem;
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
  prettifyModule: (id: string) => void,
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
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 87) {
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

  prettifyModule = () => {
    this.props.prettifyModule(this.props.currentModuleId);
  };

  canPrettify = (module: ?Module) => {
    if (!module) {
      return false;
    }

    return canPrettify(module.title);
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

    tabs.filter(tab => moduleObject[tab.moduleId]).forEach(tab => {
      const module = moduleObject[tab.moduleId];

      tabNamesObject[module.title] = tabNamesObject[module.title] || [];
      tabNamesObject[module.title].push(module.id);
    });

    const currentModule = moduleObject[currentModuleId];

    return (
      <Container>
        <TabsContainer
          innerRef={el => {
            this.container = el;
          }}
        >
          {tabs
            .map(tab => ({ ...tab, module: moduleObject[tab.moduleId] }))
            .filter(tab => tab.module)
            .map((tab, i) => {
              const { module } = tab;
              const modulesWithName = tabNamesObject[module.title];
              let dirName = null;

              if (
                modulesWithName.length > 1 &&
                module.directoryShortid != null
              ) {
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
        </TabsContainer>
        <IconContainer>
          <Tooltip title="Prettify">
            <StyledPrettierIcon
              disabled={!this.canPrettify(currentModule)}
              onClick={this.prettifyModule}
            />
          </Tooltip>
        </IconContainer>
      </Container>
    );
  }
}
