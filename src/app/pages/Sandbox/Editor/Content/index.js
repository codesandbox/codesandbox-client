// @flow
import React from 'react';
import styled from 'styled-components';
import { Prompt } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import type { Preferences } from 'app/store/preferences/reducer';
import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import type { User } from 'app/store/user/reducer';
import { userSelector } from 'app/store/user/selectors';
import moduleActionCreators from 'app/store/entities/sandboxes/modules/actions';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import userActionCreators from 'app/store/user/actions';
import {
  isMainModule,
  getModulePath,
} from 'app/store/entities/sandboxes/modules/selectors';

import SplitPane from 'react-split-pane';

import CodeEditor from 'app/components/sandbox/CodeEditor';
import Preview from 'app/components/sandbox/Preview';

import Header from './Header';

type Props = {
  sandbox: Sandbox,
  user: User,
  preferences: Preferences,
  moduleActions: typeof moduleActionCreators,
  sandboxActions: typeof sandboxActionCreators,
  userActions: typeof userActionCreators,
};

type State = {
  resizing: boolean,
};

const FullSize = styled.div`
  height: 100%;
  width: 100%;
  pointer-events: ${props => props.inactive ? 'none' : 'all'};
`;

const mapStateToProps = state => ({
  preferences: preferencesSelector(state),
  user: userSelector(state),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleActionCreators, dispatch),
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  userActions: bindActionCreators(userActionCreators, dispatch),
});
class EditorPreview extends React.PureComponent {
  props: Props;
  state: State;

  state = {
    resizing: false,
  };

  componentDidMount() {
    window.onbeforeunload = () => {
      const { sandbox } = this.props;
      const notSynced = sandbox.modules.some(m => m.isNotSynced);

      if (notSynced) {
        return 'You have not saved all your modules, are you sure you want to close this tab?';
      }

      return null;
    };
  }

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  saveCode = () => {
    const { sandbox, sandboxActions } = this.props;

    const mainModule = sandbox.modules.find(isMainModule);
    const { currentModule = mainModule } = sandbox;

    sandboxActions.saveModuleCode(sandbox.id, currentModule.id);
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
      preferences,
      userActions,
      user,
    } = this.props;

    const { modules, directories } = sandbox;
    const mainModule = modules.find(isMainModule);
    const { currentModule = mainModule } = sandbox;

    const modulePath = getModulePath(modules, directories, currentModule.id);

    if (currentModule == null) return null;

    const notSynced = sandbox.modules.some(m => m.isNotSynced);

    const EditorPane = (
      <FullSize>
        <CodeEditor
          changeCode={moduleActions.setCode}
          id={currentModule.id}
          error={currentModule.error}
          code={currentModule.code}
          title={currentModule.title}
          canSave={currentModule.isNotSynced}
          saveCode={this.saveCode}
          modulePath={modulePath}
          preferences={preferences}
        />
      </FullSize>
    );

    const PreviewPane = (
      <FullSize inactive={this.state.resizing}>
        <Preview
          sandboxId={sandbox.id}
          bundle={sandbox.dependencyBundle}
          fetchBundle={sandboxActions.fetchDependenciesBundle}
          module={currentModule}
          modules={modules}
          directories={directories}
          setError={moduleActions.setError}
          isInProjectView={sandbox.isInProjectView}
          externalResources={sandbox.externalResources}
          setProjectView={sandboxActions.setProjectView}
          preferences={preferences}
          sandboxActions={sandboxActions}
        />
      </FullSize>
    );

    return (
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
          user={user}
        />
        <SplitPane
          onDragStarted={this.startResizing}
          onDragFinished={this.stopResizing}
          split="vertical"
          defaultSize="50%"
          minSize={360}
          primary="second"
          paneStyle={{ height: '100%' }}
          pane1Style={{ display: sandbox.showEditor ? 'block' : 'none' }}
          pane2Style={{
            display: sandbox.showPreview ? 'block' : 'none',
            minWidth: sandbox.showPreview && !sandbox.showEditor
              ? '100%'
              : 'inherit',
          }}
        >
          {sandbox.showEditor && EditorPane}
          {PreviewPane}
        </SplitPane>
      </FullSize>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPreview);
