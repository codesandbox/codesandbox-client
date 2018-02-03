// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { sortBy } from 'lodash';
import {
  modulesFromSandboxSelector,
  findMainModule,
  findCurrentModule,
} from 'app/store/entities/sandboxes/modules/selectors';
import { directoriesFromSandboxSelector } from 'app/store/entities/sandboxes/directories/selectors';

import type { Sandbox, Module, Directory } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import DirectoryEntry from './DirectoryEntry/index';
import WorkspaceItem from '../WorkspaceItem';

import EditIcons from './DirectoryEntry/Entry/EditIcons';

type Props = {
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
  sandboxActions: typeof sandboxActionCreators,
};
const mapStateToProps = createSelector(
  modulesFromSandboxSelector,
  directoriesFromSandboxSelector,
  (modules, directories) => ({ modules, directories })
);
class Files extends React.PureComponent<Props> {
  directory: typeof DirectoryEntry;

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

  createModule = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this.directory.onCreateModuleClick();
  };

  createDirectory = () => {
    // INCREDIBLY BAD PRACTICE! TODO: FIX THIS
    this.directory.onCreateDirectoryClick();
  };

  uploadImage = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.onchange = event => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const payload = new FormData();
      payload.append('type', 'file');
      payload.append('image', file);

      fetch('https://api.imgur.com/3/upload.json', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Client-ID dc708f3823b7756', // imgur specific
        },
        body: payload,
      })
        .then(response => {
          if (response.status === 200 || response.status === 0) {
            return response.json();
          } else {
            return Promise.reject(new Error(`Error uploading to imgur.`));
          }
        })
        .then(json => {
          const code = json.data.link;
          const title = file.name;

          // create the file with the title it was uploaded as
          this.directory.createModule(undefined, title, true, code);
        })
        .catch(error => console.error(`Failed to upload image: ${error}`));
    };
    fileSelector.click();
  };

  render() {
    const { sandbox, modules, directories } = this.props;
    if (sandbox == null) return null;

    const mainModule = findMainModule(modules, directories, sandbox.entry);
    const { currentModule: currentModuleId } = sandbox;
    const currentModule = findCurrentModule(
      modules,
      directories,
      currentModuleId,
      mainModule
    );

    return (
      <WorkspaceItem
        defaultOpen
        keepState
        title="Files"
        actions={
          <EditIcons
            hovering
            onUploadImage={this.uploadImage}
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
          mainModuleId={mainModule.id}
          modules={sortBy(modules, 'title')}
          directories={sortBy(directories, 'title')}
          isInProjectView={sandbox.isInProjectView}
          currentModuleId={currentModule.id}
          depth={-1}
          id={null}
          shortid={null}
        />
      </WorkspaceItem>
    );
  }
}

export default connect(mapStateToProps)(Files);
