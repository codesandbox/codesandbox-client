// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import type { Preferences } from 'app/store/preferences/reducer';

import SplitPane from 'react-split-pane';

import CodeEditor from './subviews/CodeEditor';
import Preview from './subviews/Preview';

import type { Sandbox } from '../../../../../store/entities/sandboxes/entity';
import moduleActionCreators
  from '../../../../../store/entities/sandboxes/modules/actions';
import sandboxActionCreators
  from '../../../../../store/entities/sandboxes/actions';
import {
  isMainModule,
  getModulePath,
} from '../../../../../store/entities/sandboxes/modules/selectors';
import Header from './Header';

type Props = {
  sandbox: Sandbox,
  preferences: Preferences,
  moduleActions: typeof moduleActionCreators,
  sandboxActions: typeof sandboxActionCreators,
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
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleActionCreators, dispatch),
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
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
    } = this.props;

    const { modules, directories } = sandbox;
    const mainModule = modules.find(isMainModule);
    const { currentModule = mainModule } = sandbox;

    const modulePath = getModulePath(modules, directories, currentModule.id);

    if (currentModule == null) return null;

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
          setProjectView={sandboxActions.setProjectView}
          preferences={preferences}
        />
      </FullSize>
    );

    const Both = (
      <SplitPane
        onDragStarted={this.startResizing}
        onDragFinished={this.stopResizing}
        split="vertical"
        defaultSize="50%"
        minSize={360}
        primary="second"
        paneStyle={{ height: '100%' }}
      >
        {EditorPane}
        {PreviewPane}
      </SplitPane>
    );

    return (
      <FullSize>
        <Header sandbox={sandbox} sandboxActions={sandboxActions} />
        {sandbox.showEditor && !sandbox.showPreview && EditorPane}
        {!sandbox.showEditor && sandbox.showPreview && PreviewPane}
        {sandbox.showEditor && sandbox.showPreview && Both}
      </FullSize>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPreview);
