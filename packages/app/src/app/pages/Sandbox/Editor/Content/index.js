// @flow
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { createSelector } from 'reselect';
import { Prompt } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import type {
  Preferences,
  Sandbox,
  CurrentUser,
  Module,
  Directory,
} from 'common/types';
import { currentUserSelector } from 'app/store/user/selectors';
import moduleActionCreators from 'app/store/entities/sandboxes/modules/actions';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import modalActionCreators from 'app/store/modal/actions';
import previewApiActionCreators from 'app/store/preview-actions-api/actions';
import preferenceActionCreators from 'app/store/preferences/actions';
import userActionCreators from 'app/store/user/actions';
import viewActionCreators from 'app/store/view/actions';
import { devToolsOpenSelector } from 'app/store/view/selectors';
import {
  findMainModule,
  findCurrentModule,
  modulesFromSandboxSelector,
} from 'app/store/entities/sandboxes/modules/selectors';
import { directoriesFromSandboxSelector } from 'app/store/entities/sandboxes/directories/selectors';

import getTemplateDefinition from 'common/templates';

import SplitPane from 'react-split-pane';

import CodeEditor from 'app/components/sandbox/CodeEditor';
import Tabs from 'app/components/sandbox/CodeEditor/Tabs';
import FilePath from 'app/components/sandbox/CodeEditor/FilePath';
import Preview from 'app/components/sandbox/Preview';

import showAlternativeComponent from 'app/hoc/show-alternative-component';
import fadeIn from 'common/utils/animation/fade-in';

import Header from './Header';
import Skeleton from './Skeleton';

type Props = {
  workspaceHidden: boolean,
  toggleWorkspace: () => void,
  devToolsOpen: boolean,
  sandbox: Sandbox,
  user: CurrentUser,
  preferences: Preferences,
  modules: Array<Module>,
  directories: Array<Directory>,
  moduleActions: typeof moduleActionCreators,
  sandboxActions: typeof sandboxActionCreators,
  userActions: typeof userActionCreators,
  modalActions: typeof modalActionCreators,
  previewApiActions: typeof previewApiActionCreators,
  preferenceActions: typeof preferenceActionCreators,
  viewActions: typeof viewActionCreators,
};

type State = {
  resizing: boolean,
};

const FullSize = styled.div`
  height: 100%;
  width: 100%;

  ${fadeIn(0)};
  display: flex;
  flex-direction: column;
`;

const mapStateToProps = createSelector(
  preferencesSelector,
  currentUserSelector,
  modulesFromSandboxSelector,
  directoriesFromSandboxSelector,
  devToolsOpenSelector,
  (preferences, user, modules, directories, devToolsOpen) => ({
    preferences,
    user,
    modules,
    directories,
    devToolsOpen,
  })
);
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleActionCreators, dispatch),
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  userActions: bindActionCreators(userActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
  previewApiActions: bindActionCreators(previewApiActionCreators, dispatch),
  preferenceActions: bindActionCreators(preferenceActionCreators, dispatch),
  viewActions: bindActionCreators(viewActionCreators, dispatch),
});
class EditorPreview extends React.PureComponent<Props, State> {
  state = {
    resizing: false,
  };

  componentDidMount() {
    window.onbeforeunload = e => {
      const { modules } = this.props;
      const notSynced = modules.some(m => m.isNotSynced);

      if (notSynced) {
        const returnMessage =
          'You have not saved all your modules, are you sure you want to close this tab?';
        e.returnValue = returnMessage;
        return returnMessage;
      }

      return null;
    };
  }

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  saveCode = () => {
    const { sandbox, modules, directories, sandboxActions } = this.props;

    const mainModule = findMainModule(modules, directories, sandbox.entry);
    const { currentModule } = sandbox;

    // $FlowIssue
    sandboxActions.saveModuleCode(sandbox.id, currentModule || mainModule.id);
  };

  getDefaultSize = () => {
    const { sandbox } = this.props;
    if (sandbox.showEditor && !sandbox.showPreview) return '0%';
    if (!sandbox.showEditor && sandbox.showPreview) return '100%';
    return '50%';
  };

  exitZenMode = () => {
    this.props.preferenceActions.setPreference({ zenMode: false });
  };

  render() {
    const {
      moduleActions,
      sandboxActions,
      sandbox,
      modules,
      directories,
      preferences,
      userActions,
      modalActions,
      user,
      workspaceHidden,
      toggleWorkspace,
      previewApiActions,
      viewActions,
      devToolsOpen,
    } = this.props;

    const mainModule = findMainModule(modules, directories, sandbox.entry);
    if (!mainModule) throw new Error('Cannot find main module');

    const { currentModule: currentModuleId } = sandbox;

    const currentModule = findCurrentModule(
      modules,
      directories,
      currentModuleId,
      mainModule
    );

    if (currentModule == null) return null;

    const notSynced = modules.some(m => m.isNotSynced);

    const EditorPane = (
      <FullSize>
        {preferences.zenMode ? (
          <FilePath
            modules={modules}
            directories={directories}
            currentModule={currentModule}
            workspaceHidden={workspaceHidden}
            toggleWorkspace={toggleWorkspace}
            exitZenMode={this.exitZenMode}
          />
        ) : (
          <Tabs
            tabs={sandbox.tabs}
            modules={modules}
            directories={directories}
            currentModuleId={currentModule.id}
            sandboxId={sandbox.id}
            setCurrentModule={sandboxActions.setCurrentModule}
            closeTab={sandboxActions.closeTab}
            moveTab={sandboxActions.moveTab}
            markNotDirty={sandboxActions.markTabsNotDirty}
            prettifyModule={moduleActions.prettifyModule}
          />
        )}
        <CodeEditor
          changeCode={moduleActions.setCode}
          id={currentModule.id}
          errors={currentModule.errors}
          corrections={currentModule.corrections}
          code={currentModule.code}
          title={currentModule.title}
          saveCode={this.saveCode}
          preferences={preferences}
          modules={modules}
          directories={directories}
          sandboxId={sandbox.id}
          dependencies={sandbox.npmDependencies}
          setCurrentModule={sandboxActions.setCurrentModule}
          addDependency={sandbox.owned && sandboxActions.addNPMDependency}
          template={sandbox.template}
        />
      </FullSize>
    );

    const PreviewPane = (
      <FullSize>
        <Preview
          sandboxId={sandbox.id}
          template={sandbox.template}
          initialPath={sandbox.initialPath}
          module={currentModule}
          modules={modules}
          directories={directories}
          addError={sandboxActions.addError}
          clearErrors={moduleActions.clearErrors}
          isInProjectView={Boolean(sandbox.isInProjectView)}
          externalResources={sandbox.externalResources}
          setProjectView={sandboxActions.setProjectView}
          preferences={preferences}
          sandboxActions={sandboxActions}
          dependencies={sandbox.npmDependencies}
          runActionFromPreview={previewApiActions.executeAction}
          forcedRenders={sandbox.forcedRenders}
          inactive={this.state.resizing}
          entry={sandbox.entry}
          setDevToolsOpen={viewActions.setDevToolsOpen}
          devToolsOpen={devToolsOpen}
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
          {!preferences.zenMode && (
            <Header
              sandboxId={sandbox.id}
              owned={sandbox.owned}
              showEditor={sandbox.showEditor}
              showPreview={sandbox.showPreview}
              sandboxLiked={sandbox.userLiked}
              sandboxLikeCount={sandbox.likeCount}
              sandboxActions={sandboxActions}
              userActions={userActions}
              modalActions={modalActions}
              user={user}
              workspaceHidden={workspaceHidden}
              toggleWorkspace={toggleWorkspace}
              canSave={notSynced}
              modules={sandbox.modules}
              directories={sandbox.directories}
            />
          )}
          <SplitPane
            onDragStarted={this.startResizing}
            onDragFinished={this.stopResizing}
            split="vertical"
            defaultSize="50%"
            minSize={360}
            style={{ position: 'static' }}
            resizerStyle={{
              visibility:
                (!sandbox.showPreview && sandbox.showEditor) ||
                (sandbox.showPreview && !sandbox.showEditor)
                  ? 'hidden'
                  : 'visible',
            }}
            pane1Style={{
              display: sandbox.showEditor ? 'block' : 'none',
              minWidth:
                !sandbox.showPreview && sandbox.showEditor ? '100%' : 'inherit',
            }}
            pane2Style={{
              display: sandbox.showPreview ? 'block' : 'none',
              minWidth:
                sandbox.showPreview && !sandbox.showEditor ? '100%' : 'inherit',
              height: '100%',
            }}
          >
            {sandbox.showEditor && EditorPane}
            {PreviewPane}
          </SplitPane>
        </FullSize>
      </ThemeProvider>
    );
  }
}

export default showAlternativeComponent(Skeleton, ['sandbox'])(
  connect(mapStateToProps, mapDispatchToProps)(EditorPreview)
);
