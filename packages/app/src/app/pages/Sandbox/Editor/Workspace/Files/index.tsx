
import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import DirectoryEntry from './DirectoryEntry/index';
import WorkspaceItem from '../WorkspaceItem';

import EditIcons from './DirectoryEntry/Entry/EditIcons';

class Files extends React.Component<WithCerebral> {
  directory
  createModule = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this.directory.onCreateModuleClick();
  };

  createDirectory = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this.directory.onCreateDirectoryClick();
  };

  uploadFile = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this.directory.onUploadFileClick();
  };

  render() {
    const store = this.props.store;
    const sandbox = store.editor.currentSandbox;

    const openedModulesByUsers = {};

    // if (store.live.isLive) {
    //   store.live.usersMetadata.forEach(user => {
    //     openedModulesByUsers[user.currentModuleShortid] =
    //       openedModulesByUsers[user.currentModuleShortid] || [];
    //     openedModulesByUsers[user.currentModuleShortid].push(user.color);
    //   });
    // }

    return (
      <WorkspaceItem
        defaultOpen
        keepState
        title="Files"
        actions={
          <EditIcons
            hovering
            forceShow={window.__isTouch}
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
          depth={-1}
          id={null}
          shortid={null}
        />
      </WorkspaceItem>
    );
  }
}

export default connect()(Files);
