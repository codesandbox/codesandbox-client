// @flow
import React from 'react';
import { Match } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { Sandbox } from '../../../../store/entities/sandboxes/';
import sandboxEntity from '../../../../store/entities/sandboxes';
import moduleEntity from '../../../../store/entities/modules';
import directoryEntity from '../../../../store/entities/directories';
import { editModuleUrl, versionsUrl, sandboxDependenciesUrl } from '../../../../utils/url-generator';

import CodeEditor from './CodeEditor';
import Versions from './Versions';
import Dependencies from './Dependencies';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
`;

type Props = {
  sandbox: ?Sandbox;
  moduleActions: typeof moduleEntity.actions;
  sandboxActions: typeof sandboxEntity.actions;
  directoryActions: typeof directoryEntity.actions;
  params: {
    id: ?string;
    slug: ?string;
    username: ?string;
  };
}
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
  directoryActions: bindActionCreators(directoryEntity.actions, dispatch),
});
class Workspace extends React.PureComponent { // eslint-disable-line
  props: Props;

  render() {
    const { sandbox, moduleActions, directoryActions, sandboxActions } = this.props;
    if (sandbox == null) return null;

    return (
      <Container>
        <Match
          pattern={editModuleUrl(sandbox)}
          render={() => (
            <CodeEditor
              sandbox={sandbox}
              moduleActions={moduleActions}
              directoryActions={directoryActions}
              sandboxActions={sandboxActions}
            />
          )}
        />

        <Match
          pattern={versionsUrl(sandbox)}
          render={() => (
            <Versions sandbox={sandbox} />
          )}
        />

        <Match
          pattern={sandboxDependenciesUrl(sandbox)}
          component={Dependencies}
        />
      </Container>
    );
  }
}
export default connect(null, mapDispatchToProps)(Workspace);
// <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />;
