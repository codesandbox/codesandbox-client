/* @flow */
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';

import CodeEditor from './CodeEditor';
import Preview from './Preview';
import moduleEntity from '../../../store/entities/modules/';
import { modulesBySandboxSelector, moduleByPathSelector } from '../../../store/entities/modules/selector';
import Workspace from './Workspace';

import type { Module } from '../../../store/entities/modules';
import type { Sandbox } from '../../../store/entities/sandboxes';
import type { Directory } from '../../../store/entities/directories/index';
import { directoriesBySandboxSelector } from '../../../store/entities/directories/selector';
import EntryIcons from './Workspace/DirectoryEntry/Entry/EntryIcons';

const Tabs = styled.div`
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
  display: flex;
  width: 100%;
  height: 100%;
  // flex: auto;
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
  pointer-events: ${props => props.inactive ? 'none' : 'all'};
`;

type Props = {
  sandbox: Sandbox;
  modules: Array<Module>;
  directories: Array<Directory>;
  module: Module;
  moduleActions: typeof moduleEntity.actions;
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
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
});
class Editor extends React.PureComponent {
  props: Props;
  state: State;

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

  render() {
    const { modules, directories, module, moduleActions, sandbox } = this.props;

    return (
      <SplitPane split="vertical" minSize={100} defaultSize={16 * 16}>
        <Workspace sandbox={sandbox} />
        {module && <Frame>
          <Tabs>
            <Tab active>
              <div>
                <EntryIcons type="react" />
                <span style={{ verticalAlign: 'middle' }}>{module.title}</span>
              </div>
            </Tab>
          </Tabs>
          <Content>
            <SplitPane
              onDragStarted={() => this.setState({ resizing: true })}
              onDragFinished={() => this.setState({ resizing: false })}
              split="vertical"
              defaultSize="50%"
              minSize={360}
              primary="second"
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
                  module={module}
                  modules={modules}
                  directories={directories}
                  setError={this.setError}
                />
              </FullSize>
            </SplitPane>
          </Content>
        </Frame>}
      </SplitPane>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Editor);

