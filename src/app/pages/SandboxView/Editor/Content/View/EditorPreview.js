// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SplitPane from 'react-split-pane';

import moduleEntity from '../../../../../store/entities/modules/';
import sourceEntity from '../../../../../store/entities/sources/';
import type { ModuleTab } from '../../../../../store/reducers/views/sandbox';

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import { directoriesBySandboxSelector } from '../../../../../store/entities/directories/selector';
import { modulesBySandboxSelector, currentModuleSelector, singleModuleSelector } from '../../../../../store/entities/modules/selector';
import { singleSourceSelector } from '../../../../../store/entities/sources/selector';

import type { Sandbox } from '../../../../../store/entities/sandboxes/index';
import type { Module } from '../../../../../store/entities/modules';
import type { Directory } from '../../../../../store/entities/directories';
import type { Source } from '../../../../../store/entities/sources';

type Props = {
  modules: Array<Module>;
  directories: Array<Directory>;
  module: Module;
  source: Source;
  tab: ModuleTab;
  sandbox: ?Sandbox;
  moduleActions: moduleEntity.actions;
  sourceActions: sourceEntity.actions;
};

type State = {
  resizing: boolean;
};

const FullSize = styled.div`
  height: 100%;
  width: 100%;
  pointer-events: ${props => (props.inactive ? 'none' : 'all')};
`;

const mapStateToProps = (state, props) => ({
  directories: directoriesBySandboxSelector(state, { id: props.sandbox.id }),
  modules: modulesBySandboxSelector(state, { id: props.sandbox.id }),
  module: singleModuleSelector(state, { id: props.tab ? props.tab.moduleId : null }),
  source: singleSourceSelector(state, { id: props.sandbox.source }),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sourceActions: bindActionCreators(sourceEntity.actions, dispatch),
});
class EditorPreview extends React.PureComponent {
  props: Props;
  state: State;

  state = {
    resizing: false,
  };

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  render() {
    const { source, modules, directories,
      moduleActions, module, sourceActions } = this.props;

    if (module == null) return null;
    return (
      <FullSize>
        <SplitPane
          onDragStarted={this.startResizing}
          onDragFinished={this.stopResizing}
          split="vertical"
          defaultSize="50%"
          minSize={360}
          primary="second"
          paneStyle={{ height: 'calc(100% - 35px)' }}
        >
          <FullSize>
            <CodeEditor
              changeCode={moduleActions.changeCode}
              id={module.id}
              error={module.error}
              code={module.code}
              saveCode={moduleActions.saveCode}
            />
          </FullSize>
          <FullSize inactive={this.state.resizing}>
            <Preview
              bundle={source.bundle}
              fetchBundle={sourceActions.fetchBundle}
              module={module}
              modules={modules}
              directories={directories}
              setError={moduleActions.setError}
              npmDependencies={source.npmDependencies}
            />
          </FullSize>
        </SplitPane>
      </FullSize>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPreview);
