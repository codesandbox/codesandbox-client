// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import PrettierIcon from 'react-icons/lib/md/brush';
import { inject, observer } from 'mobx-react';
import Tooltip from 'common/components/Tooltip';
import { canPrettify } from 'app/utils/prettify';
import TabContainer from './TabContainer';

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

class EditorTabs extends React.Component {
  componentWillMount() {
    window.addEventListener('keydown', this.closeListener);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeListener);
  }

  componentDidUpdate(prevProps) {
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

  closeTab = tabIndex => {
    this.props.signals.editor.tabClosed({ tabIndex });
  };

  moveTab = (moduleId, nextIndex) => {
    const prevIndex = this.props.store.editor.tabs.findIndex(
      tab => tab.moduleId === moduleId
    );
    this.props.signals.editor.tabMoved({ prevIndex, nextIndex });
  };

  /**
   * Mark all tabs not dirty (not cursive)
   */
  markNotDirty = () => {
    this.props.signals.editor.moduleDoubleClicked();
  };

  setCurrentModule = moduleId => {
    this.props.signals.editor.moduleSelected({ id: moduleId });
  };

  prettifyModule = () => {
    this.props.signals.editor.prettifyClicked();
  };

  canPrettify = module => {
    if (!module) {
      return false;
    }

    return canPrettify(module.title);
  };

  container;
  tabEls = {};

  render() {
    const { store } = this.props;
    const sandbox = store.editor.currentSandbox;
    const moduleObject = {};
    // We keep this object to keep track if there are duplicate titles.
    // In that case we need to show which directory the module is in.
    const tabNamesObject = {};

    sandbox.modules.forEach(m => {
      moduleObject[m.id] = m;
    });

    store.editor.tabs.filter(tab => moduleObject[tab.moduleId]).forEach(tab => {
      const module = moduleObject[tab.moduleId];

      tabNamesObject[module.title] = tabNamesObject[module.title] || [];
      tabNamesObject[module.title].push(module.id);
    });

    const currentModule = store.editor.currentModule;

    return (
      <Container>
        <TabsContainer
          innerRef={el => {
            this.container = el;
          }}
        >
          {store.editor.tabs
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
                const dir = sandbox.directories.find(
                  d =>
                    d.shortid === module.directoryShortid &&
                    d.sourceId === module.sourceId
                );

                if (dir) {
                  dirName = dir.title;
                }
              }

              return (
                <TabContainer
                  setCurrentModule={this.setCurrentModule}
                  active={currentModule.id === tab.module.id}
                  key={tab.module.id}
                  module={tab.module}
                  hasError={Boolean(
                    store.editor.errors.filter(
                      error => error.moduleId === tab.module.id
                    ).length
                  )}
                  closeTab={this.closeTab}
                  moveTab={this.moveTab}
                  markNotDirty={this.markNotDirty}
                  dirName={dirName}
                  tabCount={store.editor.tabs.length}
                  position={i}
                  dirty={tab.dirty}
                  isNotSynced={Boolean(
                    store.editor.changedModuleShortids.includes(
                      tab.module.shortid
                    )
                  )}
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

export default inject('signals', 'store')(observer(EditorTabs));
