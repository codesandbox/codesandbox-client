// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
} from '../../../../../store/entities/sandboxes/modules/selectors';

type Props = {
  sandbox: Sandbox,
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

  render() {
    const {
      moduleActions,
      sandboxActions,
      sandbox,
    } = this.props;

    const { modules, directories } = sandbox;
    const mainModule = modules.find(isMainModule);
    const { currentModule = mainModule } = sandbox;

    if (currentModule == null) return null;

    return (
      <FullSize>
        <SplitPane
          onDragStarted={this.startResizing}
          onDragFinished={this.stopResizing}
          split="vertical"
          defaultSize="50%"
          minSize={360}
          primary="second"
          paneStyle={{ height: '100%' }}
        >
          <FullSize>
            <CodeEditor
              changeCode={moduleActions.setCode}
              id={currentModule.id}
              error={currentModule.error}
              code={currentModule.code}
              title={currentModule.title}
              canSave={currentModule.isNotSynced}
              saveCode={this.saveCode}
              modulePath="TODO"
            />
          </FullSize>
          <FullSize inactive={this.state.resizing}>
            <Preview
              sandboxId={sandbox.id}
              bundle={sandbox.dependencyBundle}
              fetchBundle={sandboxActions.fetchDependenciesBundle}
              module={currentModule}
              modules={modules}
              directories={directories}
              setError={moduleActions.setError}
            />
          </FullSize>
        </SplitPane>
      </FullSize>
    );
  }
}

export default connect(null, mapDispatchToProps)(EditorPreview);
