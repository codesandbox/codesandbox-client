import { inject, observer } from 'app/componentConnectors';
import * as React from 'react';

import EditIcons from './DirectoryEntry/Entry/EditIcons';
import DirectoryEntry from './DirectoryEntry/index';

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

  getModulePath = moduleId => {
    try {
      const sandbox = this.props.store.editor.currentSandbox;
      return sandbox.modules.find(module => module.id === moduleId).path;
    } catch (e) {
      return '';
    }
  };

  render() {
    const { store } = this.props;
    const sandbox = store.editor.currentSandbox;

    return (
      <DirectoryEntry
        root
        getModulePath={this.getModulePath}
        title={sandbox.title || 'Project'}
        signals={
          this.props
            .signals /* TODO: Just pass what is needed by the DragDrop */
        }
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
