import React from 'react';

import { sortBy } from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import DirectoryEntry from './DirectoryEntry/index';

import type {
  Sandbox,
} from '../../../../../../store/entities/sandboxes/entity';
import sandboxActionCreators
  from '../../../../../../store/entities/sandboxes/actions';
import {
  isMainModule,
} from '../../../../../../store/entities/sandboxes/modules/validator';

type Props = {
  sandbox: ?Sandbox,
  sandboxActions: typeof sandboxActionCreators,
};
class Files extends React.PureComponent {
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

    const mainModule = sandbox.modules.find(isMainModule);

    const { currentModule = mainModule } = sandbox;

    if (sandbox == null) return null;

    return (
      <DirectoryEntry
        root
        title={sandbox.title || 'Project'}
        sandboxId={sandbox.id}
        modules={sortBy(sandbox.modules, 'title')}
        directories={sortBy(sandbox.directories, 'title')}
        isInProjectView={sandbox.isInProjectView}
        currentModuleId={currentModule.id}
        renameSandbox={this.renameSandbox}
        id={null}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(Files);
