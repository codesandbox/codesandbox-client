// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';

import type { Module } from '../../../../store/entities/modules';
import type { Directory } from '../../../../store/entities/directories';
import type { Source } from '../../../../store/entities/sources';
import type { Sandbox } from '../../../../store/entities/sandboxes';
import type { State as ViewState } from '../../../../store/reducers/views/sandbox';

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import Tabs from './Tabs';
import moduleEntity from '../../../../store/entities/modules/';
import sourceEntity from '../../../../store/entities/sources/';
import { directoriesBySandboxSelector } from '../../../../store/entities/directories/selector';
import { currentModuleSelector, modulesBySandboxSelector } from '../../../../store/entities/modules/selector';
import { singleSourceSelector } from '../../../../store/entities/sources/selector';
import viewActions from '../../../../store/actions/views/sandbox';

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  width: 100%;
  height: 100%;
`;

const FullSize = styled.div`
  height: 100%;
  width: 100%;
  pointer-events: ${props => (props.inactive ? 'none' : 'all')};
`;

type Props = {
  modules: Array<Module>;
  directories: Array<Directory>;
  module: Module;
  source: Source;
  sandbox: Sandbox;
  view: ViewState;
  moduleActions: moduleEntity.actions;
  sourceActions: sourceEntity.actions;
  params: {
    module: string;
  };
  setTab: (id: string) => void;
};
type State = {
  resizing: boolean;
};

const mapStateToProps = (state, props) => ({
  view: state.views.sandbox,
  directories: directoriesBySandboxSelector(state, { id: props.sandbox.id }),
  modules: modulesBySandboxSelector(state, { id: props.sandbox.id }),
  module: currentModuleSelector(state),
  source: singleSourceSelector(state, { id: props.sandbox.source }),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sourceActions: bindActionCreators(sourceEntity.actions, dispatch),
  setTab: bindActionCreators(viewActions, dispatch).setTab,
  closeTab: bindActionCreators(viewActions, dispatch).closeTab,
});
class Content extends React.PureComponent {
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

  onChange = (code: string = '') => {
    const { moduleActions, module } = this.props;
    if (this.props.module.code !== code) {
      moduleActions.changeCode(module.id, code);
    }
  };

  setError = (error: ?{ message: string; line: number }) => {
    const { module } = this.props;
    this.props.moduleActions.setError(module.id, error);
  };

  startResizing = () => this.setState({ resizing: true });
  stopResizing = () => this.setState({ resizing: false });

  fetchBundle = () => {
    const { source, sourceActions } = this.props;
    if (this.currentBundler) {
      this.currentBundler.cancel();
    }
    this.currentBundler = sourceActions.fetchBundle(source.id);
  };

  currentBundler: {
    cancel: () => void;
  };
  props: Props;
  state: State;

  state = {
    resizing: false,
  };

  render() {
    const { modules, view, setTab, closeTab,
      directories, source, module, moduleActions } = this.props;
    if (!module) return null;
    return (
      <Frame>
        <Tabs
          setTab={setTab}
          closeTab={closeTab}
          currentTab={view.currentTab}
          tabs={view.tabs}
        />
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
                onChange={this.onChange}
                id={module.id}
                error={module.error}
                code={module.code}
                saveCode={moduleActions.saveCode}
              />
            </FullSize>
            <FullSize inactive={this.state.resizing}>
              <Preview
                bundle={source.bundle}
                fetchBundle={this.fetchBundle}
                module={module}
                modules={modules}
                directories={directories}
                setError={this.setError}
                npmDependencies={source.npmDependencies}
              />
            </FullSize>
          </SplitPane>
        </FullSize>
      </Frame>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);

