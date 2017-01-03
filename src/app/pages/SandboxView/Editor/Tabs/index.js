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

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import EntryIcons from '../Workspace/CodeEditor/DirectoryEntry/Entry/EntryIcons';
import moduleEntity from '../../../../store/entities/modules/';
import sourceEntity from '../../../../store/entities/sources/';
import { directoriesBySandboxSelector } from '../../../../store/entities/directories/selector';
import { moduleByPathSelector, modulesBySandboxSelector } from '../../../../store/entities/modules/selector';
import { singleSourceSelector } from '../../../../store/entities/sources/selector';


const TabsContainer = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.white};
  font-weight: 200;
`;

const Tab = styled.span`
  transition: 0.3s ease all;
  display: inline-block;

  text-align: center;
  background-color: ${props => props.active && props.theme.background2};
  border-right: 1px solid ${props => props.theme.background2};
  // border-left: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  border-radius: 2px;
  font-weight: 400;
  padding: 0.5rem 2rem;
  // min-width: 100px;
  cursor: pointer;
  color: ${props => props.active ? 'inherit' : props.theme.white.clearer(0.5)};

  svg {
    margin-right: 0.5rem;
    vertical-align: middle;
  }

  &:hover {
    background-color: ${props => props.theme.background.darken(0.2)};
    color: white;
  }
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
`;

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
  moduleActions: moduleEntity.actions;
  sourceActions: sourceEntity.actions;
  params: {
    module: string;
  };
};
type State = {
  resizing: boolean;
};

const mapStateToProps = (state, props) => ({
  directories: directoriesBySandboxSelector(state, { id: props.sandbox.id }),
  modules: modulesBySandboxSelector(state, { id: props.sandbox.id }),
  module: moduleByPathSelector(state, {
    id: props.sandbox.id,
    modulePath: (!props.params.module || props.params.module === 'undefined') ? './' : `./${props.params.module}`,
  }),
  source: singleSourceSelector(state, { id: props.sandbox.source }),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sourceActions: bindActionCreators(sourceEntity.actions, dispatch),
});
class Tabs extends React.PureComponent {
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
    const { modules, directories, source, module, moduleActions } = this.props;
    if (!module) return null;
    return (
      <Frame>
        <TabsContainer>
          <Tab active>
            <div>
              <EntryIcons type="react" />
              <span style={{ verticalAlign: 'middle' }}>{module.title}</span>
            </div>
          </Tab>
        </TabsContainer>
        <Content>
          <SplitPane
            onDragStarted={() => this.setState({ resizing: true })}
            onDragFinished={() => this.setState({ resizing: false })}
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
        </Content>
      </Frame>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);

