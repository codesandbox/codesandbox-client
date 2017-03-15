import React from 'react';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DirectoryEntry from './DirectoryEntry/index';
import DeleteTarget from './DeleteTarget';
import type {
  Sandbox,
} from '../../../../../../store/entities/sandboxes/entity';
import sandboxActionCreators
  from '../../../../../../store/entities/sandboxes/actions';
import WorkspaceTitle from '../WorkspaceTitle';

type Props = {
  sandbox: ?Sandbox,
  sandboxActions: typeof sandboxActionCreators,
};
class CodeEditor extends React.PureComponent {
  props: Props;

  renameSandbox = (title: string) => {
    const { sandbox, sandboxActions } = this.props;
    if (sandbox && sandbox.id) {
      sandboxActions.renameSandbox(sandbox.id, title);
    }
  };

  deleteModule = id => {
    const { sandboxActions, sandbox } = this.props;
    if (sandbox) {
      sandboxActions.deleteModule(sandbox.id, id);
    }
  };

  deleteDirectory = id => {
    const { sandboxActions, sandbox } = this.props;
    if (sandbox) {
      sandboxActions.deleteDirectory(sandbox.id, id);
    }
  };

  render() {
    const { sandbox } = this.props;

    return (
      <div>
        <WorkspaceTitle>Code Editor</WorkspaceTitle>
        {sandbox &&
          <DirectoryEntry
            root
            title={sandbox.title}
            sandboxId={sandbox.id}
            modules={sandbox.modules}
            directories={sandbox.directories}
            renameSandbox={this.renameSandbox}
            id={null}
          />}
        <DeleteTarget
          deleteDirectory={this.deleteDirectory}
          deleteModule={this.deleteModule}
        />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(CodeEditor);
