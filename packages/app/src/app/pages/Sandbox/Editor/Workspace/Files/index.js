import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { getModulePath } from 'common/sandbox/modules';

import DirectoryEntry from './DirectoryEntry/index';
import WorkspaceItem from '../WorkspaceItem';

import EditIcons from './DirectoryEntry/Entry/EditIcons';

class Files extends React.Component {
  createModule = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this._createModule();
  };

  createDirectory = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this._createDirectory();
  };

  uploadFile = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this._uploadFile();
  };

  getModulePath = (moduleId: string) => {
    try {
      const sandbox = this.props.store.editor.currentSandbox;
      return getModulePath(sandbox.modules, sandbox.directories, moduleId);
    } catch (e) {
      return '';
    }
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
            forceShow={window.__isTouch}
            onCreateFile={this.createModule}
            onCreateDirectory={this.createDirectory}
            onUploadFile={
              store.isLoggedIn && sandbox.privacy === 0
                ? this.uploadFile
                : undefined
            }
          />
        }
      >
        <DirectoryEntry
          root
          getModulePath={this.getModulePath}
          title={sandbox.title || 'Project'}
          initializeProperties={({
            onCreateModuleClick,
            onCreateDirectoryClick,
            onUploadFileClick,
          }) => {
            this._createModule = onCreateModuleClick;
            this._createDirectory = onCreateDirectoryClick;
            this._uploadFile = onUploadFileClick;
          }}
          depth={-1}
          id={null}
          shortid={null}
        />
      </WorkspaceItem>
    );
  }
}

export default inject('signals', 'store')(observer(Files));
