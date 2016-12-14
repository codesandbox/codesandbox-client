// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import DeleteTarget from './DeleteTarget';
import SandboxTitle from './SandboxTitle';
import DirectoryEntry from './DirectoryEntry';

import type { Sandbox } from '../../../../store/entities/sandboxes/';
import { editModuleUrl } from '../../../../utils/url-generator';
import sandboxEntity from '../../../../store/entities/sandboxes';
import moduleEntity from '../../../../store/entities/modules';
import directoryEntity from '../../../../store/entities/directories';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  overflow: auto;
  min-width: 16rem;
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
  handleRenameSandbox = (title: string) => {
    const { sandbox, sandboxActions } = this.props;
    if (sandbox && sandbox.id) {
      const moduleUrl = document.location.pathname.replace(/.*?module\/?/, '');
      sandboxActions.renameSandbox(sandbox.id, title);
      // Go to direct url of sandbox, so we don't have any problems with
      // changing the url
      this.context.router.transitionTo(`${editModuleUrl(sandbox, null)}/${moduleUrl}`);
    }
  }

  render() {
    const { sandbox, moduleActions, directoryActions } = this.props;
    const url = sandbox && editModuleUrl(sandbox);

    return (
      <Container>
        <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />
        {sandbox &&
          <DirectoryEntry root url={url} title={sandbox.title} sandboxId={sandbox.id} id={null} />}
        <DeleteTarget
          deleteDirectory={directoryActions.deleteDirectory}
          deleteModule={moduleActions.deleteModule}
        />
      </Container>
    );
  }
}
Workspace.contextTypes = {
  router: React.PropTypes.object,
};
export default DragDropContext(HTML5Backend)(connect(null, mapDispatchToProps)(Workspace));
