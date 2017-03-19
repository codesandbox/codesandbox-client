// @flow
import React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { Sandbox } from '../../../../../store/entities/sandboxes/entity';
import sandboxActionCreators
  from '../../../../../store/entities/sandboxes/actions';

import CodeEditor from './CodeEditor';
// import Versions from './Versions';
import Dependencies from './Dependencies';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
`;

type Props = {
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
};

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});
class Workspace extends React.PureComponent {
  // eslint-disable-line
  props: Props;
  render() {
    const {
      sandbox,
      sandboxActions,
    } = this.props;

    console.log(sandbox.id);

    return (
      <Container>
        <CodeEditor sandbox={sandbox} sandboxActions={sandboxActions} />
        {/* <Versions sandbox={sandbox} />*/}
        <Dependencies
          sandboxId={sandbox.id}
          npmDependencies={sandbox.npmDependencies}
          sandboxActions={sandboxActions}
          processing={
            sandbox.dependencyBundle && sandbox.dependencyBundle.processing
          }
        />
      </Container>
    );
  }
}
export default connect(null, mapDispatchToProps)(Workspace);
// <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />;
