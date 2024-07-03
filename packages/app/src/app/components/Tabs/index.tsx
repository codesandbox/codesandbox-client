import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import TabContainer from './TabContainer';
import PreviewIcon from './PreviewIcon';

import {
  Container,
  TabsContainer,
  IconContainer,
  StyledPrettierIcon,
  IconWrapper,
  Line,
} from './elements';

import ModuleTab from './ModuleTab';

interface IEditorTabsProps {
  currentModuleId: string | number;
}

export const EditorTabs: React.FunctionComponent<IEditorTabsProps> = ({
  currentModuleId,
}) => {
  const editorState = useAppState().editor;
  const editorAction = useActions().editor;

  let container = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tabEls = {};

  useEffect(() => {
    const currentTab = tabEls[currentModuleId] as ModuleTab;

    // We need to scroll to the tab
    if (currentTab && container) {
      const { width } = container.getBoundingClientRect();
      const scroll = container.scrollLeft;
      const { left } = currentTab.getBoundingClientRect();

      if (left > scroll && left < scroll + width) {
        // if it's already in view
        return;
      }

      currentTab.scrollIntoView(false);
    }
  }, [container, currentModuleId, tabEls]);

  const closeTab = tabIndex => {
    editorAction.tabClosed(tabIndex);
  };

  const moveTab = (prevIndex, nextIndex) => {
    editorAction.tabMoved({ prevIndex, nextIndex });
  };

  /**
   * Mark all tabs not dirty (not cursive)
   */
  const markNotDirty = () => {
    editorAction.moduleDoubleClicked();
  };

  const setCurrentModule = moduleId => {
    editorAction.moduleSelected({ id: moduleId });
  };

  const discardModuleChanges = moduleShortid => {
    editorAction.discardModuleChanges({ moduleShortid });
  };

  const prettifyModule = () => {
    /*
      This no longer exists

    editorAction.prettifyClicked({
      moduleShortid: editorState.currentModuleShortid,
    });
    */
  };

  const canPrettify = module => {
    if (!module) {
      return false;
    }

    return canPrettify(module.title);
  };

  const sandbox = editorState.currentSandbox;
  const moduleObject = {};
  // We keep this object to keep track if there are duplicate titles.
  // In that case we need to show which directory the module is in.
  const tabNamesObject = {};

  sandbox.modules.forEach(m => {
    moduleObject[m.shortid] = m;
  });

  (editorState.tabs.filter(tab => tab.type === 'MODULE') as ModuleTab[])
    .filter(tab => moduleObject[tab.moduleShortid])
    .forEach(tab => {
      const module = moduleObject[tab.moduleShortid];

      tabNamesObject[module.title] = tabNamesObject[module.title] || [];
      tabNamesObject[module.title].push(module.shortid);
    });

  const currentTab = editorState.currentTab as ModuleTab;
  const { currentModule } = editorState;

  const previewVisible = editorState.previewWindowVisible;

  return (
    <Container>
      <TabsContainer
        ref={el => {
          container = el;
        }}
      >
        {(editorState.tabs as ModuleTab[])
          .map(tab => ({ ...tab, module: moduleObject[tab.moduleShortid] }))
          .map((tab, i) => {
            if (tab.type === 'MODULE') {
              if (tab.module == null) {
                return null;
              }

              const { module } = tab;
              const modulesWithName = tabNamesObject[module.title];
              const { id } = tab.module;
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
                <ModuleTab
                  setCurrentModule={setCurrentModule}
                  discardModuleChanges={discardModuleChanges}
                  active={
                    currentTab && currentTab.moduleShortid === tab.moduleShortid
                  }
                  key={id}
                  module={tab.module}
                  hasError={Boolean(
                    editorState.errors.filter(
                      error => (error as any).moduleId === id
                    ).length
                  )}
                  closeTab={closeTab}
                  moveTab={moveTab}
                  markNotDirty={markNotDirty}
                  dirName={dirName}
                  tabCount={editorState.tabs.length}
                  position={i}
                  dirty={tab.dirty}
                  isNotSynced={Boolean(
                    editorState.changedModuleShortids.includes(
                      tab.module.shortid
                    )
                  )}
                  ref={el => {
                    tabEls[id] = el;
                  }}
                />
              );
            }
            if (tab.type === 'DIFF') {
              return (
                <TabContainer
                  active={currentTab && currentTab.id === tab.id}
                  key={tab.id}
                  onClick={() =>
                    editorAction.currentTabChanged({ tabId: tab.id })
                  }
                  closeTab={closeTab}
                  moveTab={moveTab}
                  tabCount={editorState.tabs.length}
                  position={i}
                  dirty={tab.dirty}
                  ref={el => {
                    tabEls[tab.id] = el;
                  }}
                  title={`Diff: ${tab.titleA} - ${tab.titleB}`}
                />
              );
            }

            return null;
          })}
      </TabsContainer>

      <IconContainer>
        <Tooltip
          style={{ display: 'inline-flex', alignItems: 'center' }}
          content="Prettify"
        >
          <StyledPrettierIcon
            disabled={!canPrettify(currentModule)}
            onClick={prettifyModule}
          />
        </Tooltip>
        <Line />

        <Tooltip content={previewVisible ? 'Hide Browser' : 'Show Browser'}>
          <IconWrapper active={previewVisible}>
            <PreviewIcon onClick={() => editorAction.togglePreviewContent()} />
          </IconWrapper>
        </Tooltip>
      </IconContainer>
    </Container>
  );
};
