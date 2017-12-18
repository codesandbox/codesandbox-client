// @flow
import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { sortBy } from 'lodash';
import DirectoryEntry from './DirectoryEntry/index';
import WorkspaceItem from '../WorkspaceItem';

import EditIcons from './DirectoryEntry/Entry/EditIcons';

class Files extends React.Component {
  createModule = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    // this.props.signals.workspace.moduleCreated()
    this.directory.onCreateModuleClick();
  };

  createDirectory = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this.directory.onCreateDirectoryClick();
  };

  render() {
    const store = this.props.store;
    const sandbox = store.editor.currentSandbox;

    return (
      <WorkspaceItem
        defaultOpen
        keepState
        title="Files"
        actions={
          <EditIcons
            hovering
            onCreateFile={this.createModule}
            onCreateDirectory={this.createDirectory}
          />
        }
      >
        <DirectoryEntry
          root
          innerRef={el => {
            this.directory = el;
          }}
          title={sandbox.title || 'Project'}
          sandboxId={sandbox.id}
          sandboxTemplate={sandbox.template}
          mainModuleId={store.editor.mainModule.id}
          modules={sortBy(sandbox.modules.toJS(), 'title')}
          directories={sortBy(sandbox.directories.toJS(), 'title')}
          isInProjectView={store.editor.preferences.isInProjectView}
          currentModuleId={store.editor.currentModule.id}
          errors={store.editor.errors}
          corrections={store.editor.corrections}
          depth={-1}
          id={null}
          shortid={null}
        />
      </WorkspaceItem>
    );
  }
}

export default inject('signals', 'store')(observer(Files));
