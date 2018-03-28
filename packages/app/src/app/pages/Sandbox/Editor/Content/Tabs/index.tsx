import * as React from 'react';
import { connect } from 'app/fluent';

import { canPrettify } from 'app/utils/prettify';
import Tooltip from 'common/components/Tooltip';
import TabContainer from './TabContainer';

import {
  Container,
  TabsContainer,
  IconContainer,
  StyledPrettierIcon,
  StyledWindowIcon,
  Line,
} from './elements';


export default connect()
  .with(({ state, signals }) => ({
    currentSandbox: state.editor.currentSandbox,
    currentModule: state.editor.currentModule,
    changedModuleShortids: state.editor.changedModuleShortids,
    errors: state.editor.errors,
    previewWindow: state.editor.previewWindow,
    currentModuleShortid: state.editor.currentModuleShortid,
    tabs: state.editor.tabs,
    tabClosed: signals.editor.tabClosed,
    tabMoved: signals.editor.tabMoved,
    moduleDoubleClicked: signals.editor.moduleDoubleClicked,
    moduleSelected: signals.editor.moduleSelected,
    prettifyClicked: signals.editor.prettifyClicked,
    setPreviewContent: signals.editor.setPreviewContent
  }))
  .toClass(props =>
  class EditorTabs extends React.Component<typeof props> {
      componentWillMount() {
        window.addEventListener('keydown', this.closeListener);
      }
      componentWillUnmount() {
        window.removeEventListener('keydown', this.closeListener);
      }

      componentDidUpdate(prevProps) {
        if (this.props.currentModuleShortid !== prevProps.currentModuleShortid) {
          // We need to scroll to the tab
          if (this.tabEls[this.props.currentModuleShortid]) {
            const { width } = this.container.getBoundingClientRect();
            const scroll = this.container.scrollLeft;
            const { left } = this.tabEls[
              this.props.currentModuleShortid
            ].getBoundingClientRect();

            if (left > scroll && left < scroll + width) {
              // if it's already in view
              return;
            }

            this.tabEls[this.props.currentModuleShortid].scrollIntoView(false);
          }
        }
      }

      closeListener = e => {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 87) {
          e.preventDefault();
          const currentPos = this.props.tabs
            .filter(x => x)
            .findIndex(t => t.moduleShortid === this.props.currentModuleShortid);
          this.closeTab(currentPos);
        }
      };

      closeTab = tabIndex => {
        this.props.tabClosed({ tabIndex });
      };

      moveTab = (prevIndex, nextIndex) => {
        this.props.tabMoved({ prevIndex, nextIndex });
      };

      /**
       * Mark all tabs not dirty (not cursive)
       */
      markNotDirty = () => {
        this.props.moduleDoubleClicked();
      };

      setCurrentModule = moduleId => {
        this.props.moduleSelected({ id: moduleId });
      };

      prettifyModule = () => {
        this.props.prettifyClicked({
          moduleShortid: this.props.currentModuleShortid,
        });
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
        const { currentSandbox, currentModule, previewWindow, tabs, errors, changedModuleShortids } = this.props
        const moduleObject = {};
        // We keep this object to keep track if there are duplicate titles.
        // In that case we need to show which directory the module is in.
        const tabNamesObject = {};

        currentSandbox.modules.forEach(m => {
          moduleObject[m.shortid] = m;
        });

        tabs
          .filter(tab => moduleObject[tab.moduleShortid])
          .forEach(tab => {
            const module = moduleObject[tab.moduleShortid];

            tabNamesObject[module.title] = tabNamesObject[module.title] || [];
            tabNamesObject[module.title].push(module.shortid);
          });

        const previewVisible = !!previewWindow.content;

        return (
          <Container>
            <TabsContainer
              innerRef={el => {
                this.container = el;
              }}
            >
              {tabs
                .map(tab => ({ ...tab, module: moduleObject[tab.moduleShortid] }))
                .filter(tab => tab.module)
                .map((tab, i) => {
                  const { module } = tab;
                  const modulesWithName = tabNamesObject[module.title];
                  const id = tab.module.id;
                  let dirName = null;

                  if (
                    modulesWithName.length > 1 &&
                    module.directoryShortid != null
                  ) {
                    const dir = currentSandbox.directories.find(
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
                      active={currentModule.id === id}
                      key={id}
                      module={tab.module}
                      hasError={Boolean(
                        errors.filter(error => error.moduleId === id)
                          .length
                      )}
                      closeTab={this.closeTab}
                      moveTab={this.moveTab}
                      markNotDirty={this.markNotDirty}
                      dirName={dirName}
                      tabCount={tabs.length}
                      position={i}
                      dirty={tab.dirty}
                      isNotSynced={changedModuleShortids.indexOf(tab.module.shortid) >= 0}
                      innerRef={el => {
                        this.tabEls[id] = el;
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
              <Line />

              <Tooltip title={previewVisible ? 'Hide Browser' : 'Show Browser'}>
                <StyledWindowIcon
                  onClick={() =>
                    previewVisible
                      ? this.props.setPreviewContent({
                          content: undefined,
                        })
                      : this.props.setPreviewContent({
                          content: 'browser',
                        })
                  }
                  active={previewVisible}
                />
              </Tooltip>
            </IconContainer>
          </Container>
        );
      }
    }
  )
