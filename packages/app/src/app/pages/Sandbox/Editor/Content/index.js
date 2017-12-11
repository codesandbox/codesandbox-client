// @flow
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import getTemplateDefinition from 'common/templates';
import SplitPane from 'react-split-pane';

import CodeEditor from 'app/components/sandbox/CodeEditor';
import Tabs from 'app/components/sandbox/CodeEditor/Tabs';
import FilePath from 'app/components/sandbox/CodeEditor/FilePath';
import Preview from 'app/components/sandbox/Preview';

import fadeIn from 'common/utils/animation/fade-in';

import Header from './Header';

const FullSize = styled.div`
  height: 100%;
  width: 100%;

  ${fadeIn(0)};
  display: flex;
  flex-direction: column;
`;

class EditorPreview extends React.Component {
  componentDidMount() {
    this.props.signals.editor.contentMounted();
  }
  getDefaultSize = () => {
    const preferences = this.props.preferences;
    if (preferences.showEditor && !preferences.showPreview) return '0%';
    if (!preferences.showEditor && preferences.showPreview) return '100%';

    return '50%';
  };
  render() {
    const { signals, store } = this.props;
    const currentModule = store.editor.currentModule;
    const notSynced = !store.editor.isAllModulesSynced;
    const sandbox = store.editor.currentSandbox;
    const preferences = store.editor.preferences;

    const EditorPane = (
      <FullSize>
        {preferences.settings.zenMode ? (
          <FilePath
            modules={sandbox.modules}
            directories={sandbox.directories}
            currentModule={currentModule}
            workspaceHidden={store.editor.workspace.isWorkspaceHidden}
            toggleWorkspace={() => signals.editor.workspace.workspaceToggled()}
            exitZenMode={
              () => {} /* this.props.signals.editor.preferences.settingChanged({ zenMode }) */
            }
          />
        ) : (
          <Tabs
            tabs={store.editor.tabs}
            modules={sandbox.modules}
            directories={sandbox.directories}
            currentModuleId={currentModule.id}
            sandboxId={sandbox.id}
            setCurrentModule={(_, moduleId) =>
              signals.editor.moduleSelected({ id: moduleId })
            }
            closeTab={(_, tabIndex) => signals.editor.tabClosed({ tabIndex })}
            moveTab={(_, prevIndex, nextIndex) =>
              signals.editor.tabMoved({ prevIndex, nextIndex })
            }
            markNotDirty={() => signals.editor.moduleDoubleClicked()}
            prettifyModule={moduleId =>
              signals.editor.prettifyClicked({ moduleId })
            }
          />
        )}
        <CodeEditor
          changeCode={(_, code) => signals.editor.codeChanged({ code })}
          id={currentModule.id}
          errors={store.editor.errors}
          corrections={store.editor.corrections}
          code={currentModule.code}
          title={currentModule.title}
          saveCode={() => signals.editor.codeSaved()}
          changedModuleShortids={store.editor.changedModuleShortids}
          preferences={preferences.settings}
          modules={sandbox.modules}
          directories={sandbox.directories}
          sandboxId={sandbox.id}
          dependencies={sandbox.npmDependencies.toJS()}
          setCurrentModule={(_, moduleId) =>
            signals.editor.moduleSelected({ id: moduleId })
          }
          addDependency={(_, name, version) =>
            signals.editor.workspace.npmDependencyAdded({ name, version })
          }
          template={sandbox.template}
        />
      </FullSize>
    );

    const PreviewPane = (
      <FullSize>
        <Preview
          sandboxId={sandbox.id}
          template={sandbox.template}
          initialPath={store.editor.initialPath}
          module={currentModule}
          modules={sandbox.modules}
          directories={sandbox.directories}
          clearErrors={() => signals.editor.errorsCleared()}
          isInProjectView={store.editor.isInProjectView}
          externalResources={sandbox.externalResources}
          setProjectView={(_, isInProjectView) =>
            signals.editor.projectViewChanged({ isInProjectView })
          }
          preferences={preferences.settings}
          onNewWindow={() =>
            signals.editor.preferences.viewModeChanged({
              showEditor: true,
              showPreview: false,
            })
          }
          dependencies={sandbox.npmDependencies}
          runActionFromPreview={action =>
            signals.editor.previewActionReceived({ action })
          }
          forcedRenders={store.editor.forcedRenders}
          inactive={store.editor.isResizing}
          entry={sandbox.entry}
          setDevToolsOpen={isOpen =>
            signals.editor.preferences.devtoolsOpened({ isOpen })
          }
          devToolsOpen={preferences.showDevtools}
        />
      </FullSize>
    );

    return (
      <ThemeProvider
        theme={{
          templateColor: getTemplateDefinition(sandbox.template).color,
        }}
      >
        <FullSize>
          <Prompt
            when={notSynced}
            message={() =>
              'You have not saved this sandbox, are you sure you want to navigate away?'
            }
          />
          {!preferences.settings.zenMode && <Header />}
          <SplitPane
            onDragStarted={() => this.props.signals.editor.resizingStarted()}
            onDragFinished={() => this.props.signals.editor.resizingStopped()}
            split="vertical"
            defaultSize="50%"
            minSize={360}
            style={{ position: 'static' }}
            resizerStyle={{
              visibility:
                (!preferences.showPreview && preferences.showEditor) ||
                (preferences.showPreview && !preferences.showEditor)
                  ? 'hidden'
                  : 'visible',
            }}
            pane1Style={{
              display: preferences.showEditor ? 'block' : 'none',
              minWidth:
                !preferences.showPreview && preferences.showEditor
                  ? '100%'
                  : 'inherit',
            }}
            pane2Style={{
              display: preferences.showPreview ? 'block' : 'none',
              minWidth:
                preferences.showPreview && !preferences.showEditor
                  ? '100%'
                  : 'inherit',
              height: '100%',
            }}
          >
            {preferences.showEditor && EditorPane}
            {PreviewPane}
          </SplitPane>
        </FullSize>
      </ThemeProvider>
    );
  }
}

export default inject('signals', 'store')(observer(EditorPreview));
