import React from 'react';
import styled from 'styled-components';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DirectoryEntry from './DirectoryEntry/index';
import DeleteTarget from './DeleteTarget';
import type { Sandbox } from '../../../../../store/entities/sandboxes/';
import { editModuleUrl } from '../../../../../utils/url-generator';
import sandboxEntity from '../../../../../store/entities/sandboxes';
import moduleEntity from '../../../../../store/entities/modules';
import directoryEntity from '../../../../../store/entities/directories';
import WorkspaceTitle from '../WorkspaceTitle';

type Props = {
  sandbox: ?Sandbox;
  moduleActions: typeof moduleEntity.actions;
  sandboxActions: typeof sandboxEntity.actions;
  directoryActions: typeof directoryEntity.actions;
};
class CodeEditor extends React.PureComponent {
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
      <div>
        <WorkspaceTitle>Code Editor</WorkspaceTitle>
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
      </div>
    );
  }
}


export default DragDropContext(HTML5Backend)(CodeEditor);
