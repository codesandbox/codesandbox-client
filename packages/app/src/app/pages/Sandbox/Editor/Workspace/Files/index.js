import * as React from 'react';
import { inject, observer } from 'app/componentConnectors';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';

import DirectoryEntry from './DirectoryEntry/index';
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

  onDownload = () => {
    this.props.signals.editor.createZipClicked();
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

          if (this.props.setEditActions) {
            this.props.setEditActions(
              <EditIcons
                hovering
                forceShow={window.__isTouch}
                onCreateFile={this.createModule}
                onCreateDirectory={this.createDirectory}
                onDownload={this.onDownload}
                onUploadFile={
                  store.isLoggedIn && sandbox.privacy === 0
                    ? this.uploadFile
                    : undefined
                }
              />
            );
          }
        }}
        depth={-1}
        id={null}
        shortid={null}
      />
    );
  }
}

export default inject('signals', 'store')(observer(Files));
