// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import DeleteTarget from './DeleteTarget';
import DirectoryEntry from './DirectoryEntry';

import type { Sandbox } from '../../../../store/entities/sandboxes/';
import { editModuleUrl } from '../../../../utils/url-generator';
import sandboxEntity from '../../../../store/entities/sandboxes';
import moduleEntity from '../../../../store/entities/modules';
import directoryEntity from '../../../../store/entities/directories';

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

  renameSandbox = (title: string) => {
    const { sandbox, sandboxActions } = this.props;
    if (sandbox && sandbox.id) {
      sandboxActions.renameSandbox(sandbox.id, title);
    }
  };

  render() {
    const { sandbox, moduleActions, directoryActions } = this.props;
    const url = sandbox && editModuleUrl(sandbox);

    return (
      <Container>
        {sandbox &&
          <DirectoryEntry
            root
            url={url}
            title={sandbox.title}
            sandboxId={sandbox.id}
            sourceId={sandbox.source}
            renameSandbox={this.renameSandbox}
            id={null}
          />}
        <DeleteTarget
          deleteDirectory={directoryActions.deleteDirectory}
          deleteModule={moduleActions.deleteModule}
        />
      </Container>
    );
  }
}
export default DragDropContext(HTML5Backend)(connect(null, mapDispatchToProps)(Workspace));
// <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />;
