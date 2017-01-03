// @flow
import React from 'react';
import { Match } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import type { Sandbox } from '../../../../store/entities/sandboxes/';
import type { Source } from '../../../../store/entities/sources/';
import sandboxEntity from '../../../../store/entities/sandboxes';
import moduleEntity from '../../../../store/entities/modules';
import sourceEntity from '../../../../store/entities/sources';
import directoryEntity from '../../../../store/entities/directories';
import { editModuleUrl, versionsUrl, sandboxDependenciesUrl } from '../../../../utils/url-generator';

import CodeEditor from './CodeEditor';
import Versions from './Versions';
import Dependencies from './Dependencies';
import { singleSourceSelector } from '../../../../store/entities/sources/selector';

const Container = styled.div`
  position: absolute;
  background-color: ${props => props.theme.background};
  height: 100%;
  width: 100%;
  overflow: auto;
`;

type Props = {
  sandbox: ?Sandbox;
  source: ?Source;
  moduleActions: moduleEntity.actions;
  sourceActions: sourceEntity.actions;
  sandboxActions: sandboxEntity.actions;
  directoryActions: directoryEntity.actions;
  params: {
    id: ?string;
    slug: ?string;
    username: ?string;
  };
};

const mapStateToProps = (state, props) => ({
  source: singleSourceSelector(state, { id: props.sandbox && props.sandbox.source }),
});
const mapDispatchToProps = dispatch => ({
  sourceActions: bindActionCreators(sourceEntity.actions, dispatch),
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
  directoryActions: bindActionCreators(directoryEntity.actions, dispatch),
});
class Workspace extends React.PureComponent { // eslint-disable-line
  props: Props;
  render() {
    const { sandbox, source, moduleActions, directoryActions, sandboxActions } = this.props;
    if (source == null || sandbox == null) return null;

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
          render={() => (
            <Dependencies source={source} sandbox={sandbox} />
          )}
        />
      </Container>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
// <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />;
