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
import userActionCreators from 'app/store/user/actions';
import {
  findMainModule,
  findCurrentModule,
  getModulePath,
  modulesFromSandboxSelector,
} from 'app/store/entities/sandboxes/modules/selectors';
import { directoriesFromSandboxSelector } from 'app/store/entities/sandboxes/directories/selectors';

import getTemplateDefinition from 'common/templates';

import SplitPane from 'react-split-pane';

import CodeEditor from 'app/components/sandbox/CodeEditor';
import Preview from 'app/components/sandbox/Preview';

import showAlternativeComponent from 'app/hoc/show-alternative-component';
import fadeIn from 'app/utils/animation/fade-in';

import Header from './Header';
import Skeleton from './Skeleton';

type Props = {
  workspaceHidden: boolean,
  toggleWorkspace: () => void,
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
  (preferences, user, modules, directories) => ({
    preferences,
    user,
    modules,
    directories,
  })
);
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleActionCreators, dispatch),
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  userActions: bindActionCreators(userActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
  previewApiActions: bindActionCreators(previewApiActionCreators, dispatch),
});
class EditorPreview extends React.PureComponent<Props, State> {
  state = {
    resizing: false,
  };

  componentDidMount() {
    window.onbeforeunload = () => {
      const { modules } = this.props;
      const notSynced = modules.some(m => m.isNotSynced);

      if (notSynced) {
        return 'You have not saved all your modules, are you sure you want to close this tab?';
      }

      return null;
    };
  }

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  saveCode = () => {
    const { sandbox, modules, sandboxActions } = this.props;

    const mainModule = findMainModule(modules, sandbox.template);
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
    } = this.props;

    const mainModule = findMainModule(modules, sandbox.template);
    if (!mainModule) throw new Error('Cannot find main module');

    const { currentModule: currentModuleId } = sandbox;

    const currentModule = findCurrentModule(
      modules,
      directories,
      currentModuleId,
      mainModule
    );
    const modulePath = getModulePath(modules, directories, currentModule.id);

    if (currentModule == null) return null;

    const notSynced = modules.some(m => m.isNotSynced);

    const EditorPane = (
      <FullSize>
        <CodeEditor
          changeCode={moduleActions.setCode}
          id={currentModule.id}
          errors={currentModule.errors}
          corrections={currentModule.corrections}
          code={currentModule.code}
          title={currentModule.title}
          canSave={currentModule.isNotSynced}
          saveCode={this.saveCode}
          modulePath={modulePath}
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
              'You have not saved this sandbox, are you sure you want to navigate away?'}
          />
          <Header
            sandbox={sandbox}
            sandboxActions={sandboxActions}
            userActions={userActions}
            modalActions={modalActions}
            user={user}
            workspaceHidden={workspaceHidden}
            toggleWorkspace={toggleWorkspace}
            canSave={notSynced}
          />
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
