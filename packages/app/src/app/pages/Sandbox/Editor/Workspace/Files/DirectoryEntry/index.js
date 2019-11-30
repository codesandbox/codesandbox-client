import { inject, observer } from 'app/componentConnectors';
import { reaction } from 'mobx';
import React from 'react';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { getChildren } from '@codesandbox/common/lib/sandbox/modules';

import DirectoryChildren from './DirectoryChildren';
import DirectoryEntryModal from './DirectoryEntryModal';
import { EntryContainer, Opener, Overlay } from './elements';
import Entry from './Entry';
import validateTitle from './validateTitle';

const readDataURL = imageFile =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(imageFile);
  });

const getFiles = async files => {
  const returnedFiles = {};
  await Promise.all(
    Array.from(files)
      .filter(Boolean)
      .map(async file => {
        const dataURI = await readDataURL(file);
        returnedFiles[file.path || file.name] = {
          dataURI,
          type: file.type,
        };
      })
  );

  return returnedFiles;
};
class DirectoryEntry extends React.PureComponent {
  constructor(props) {
    super(props);

    const { id, store } = this.props;

    this.state = {
      creating: '',
      open: props.root || store.editor.shouldDirectoryBeOpen(id),
      modalConfig: {},
      isModalOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.initializeProperties) {
      this.props.initializeProperties({
        onCreateModuleClick: this.onCreateModuleClick,
        onCreateDirectoryClick: this.onCreateDirectoryClick,
        onUploadFileClick: this.onUploadFileClick,
      });
    }

    this.openListener = reaction(
      () => this.props.store.editor.currentModuleShortid,
      () => {
        if (!this.state.open) {
          const { id, store } = this.props;

          this.setState({ open: store.editor.shouldDirectoryBeOpen(id) });
        }
      }
    );
  }

  componentWillUnmount() {
    if (this.openListener) {
      this.openListener();
    }
  }

  resetState = () => this.setState({ creating: '' });

  onCreateModuleClick = () => {
    this.setState({
      creating: 'module',
      open: true,
    });

    return true;
  };

  createModule = (_, title) => {
    const { shortid } = this.props;
    this.props.signals.files.moduleCreated({
      title,
      directoryShortid: shortid,
    });
    this.resetState();
  };

  renameModule = (moduleShortid, title) => {
    this.props.signals.files.moduleRenamed({ moduleShortid, title });
  };

  confirmDeleteModule = (shortid, moduleName) => {
    this.setState({
      isModalOpen: true,
      modalConfig: {
        title: 'Delete File',
        body: (
          <span>
            Are you sure you want to delete{' '}
            <b
              css={`
                word-break: break-all;
              `}
            >
              {moduleName}
            </b>
            ?
            <br />
            The file will be permanently removed.
          </span>
        ),
        onConfirm: () => {
          this.closeModal();
          this.props.signals.files.moduleDeleted({
            moduleShortid: shortid,
          });
        },
      },
    });
  };

  onCreateDirectoryClick = () => {
    this.setState({
      creating: 'directory',
      open: true,
    });
    return true;
  };

  createDirectory = (_, title) => {
    const { shortid } = this.props;
    this.props.signals.files.directoryCreated({
      title,
      directoryShortid: shortid,
    });
    this.resetState();
  };

  onUploadFileClick = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'true');
    fileSelector.onchange = async event => {
      const files = await getFiles(event.target.files);

      this.props.signals.files.filesUploaded({
        files,
        directoryShortid: this.props.shortid,
      });
    };

    fileSelector.click();
  };

  renameDirectory = (directoryShortid, title) => {
    this.props.signals.files.directoryRenamed({ title, directoryShortid });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  confirmDeleteDirectory = (shortid, directoryName) => {
    this.setState({
      isModalOpen: true,
      modalConfig: {
        title: 'Delete Directory',
        body: (
          <span>
            Are you sure you want to delete <b>{directoryName}</b>?
            <br />
            The directory will be permanently removed.
          </span>
        ),
        onConfirm: () => {
          this.closeModal();
          this.props.signals.files.directoryDeleted({
            directoryShortid: shortid,
          });
        },
      },
    });
  };

  toggleOpen = () => this.setOpen(!this.state.open);

  closeTree = () => this.setOpen(false);

  setOpen = open => this.setState({ open });

  validateModuleTitle = (id, title) =>
    validateTitle(id, title, this.getChildren());

  validateDirectoryTitle = (id, title) => {
    const { root } = this.props;
    if (root) return false;

    return validateTitle(id, title, this.getChildren());
  };

  getChildren = () => {
    const {
      shortid,
      store: {
        editor: {
          currentSandbox: { modules, directories },
        },
      },
    } = this.props;

    return getChildren(modules, directories, shortid);
  };

  setCurrentModule = moduleId => {
    this.props.signals.editor.moduleSelected({ id: moduleId });
  };

  markTabsNotDirty = () => {
    this.props.signals.editor.moduleDoubleClicked();
  };

  confirmDiscardChanges = (shortid, moduleName) => {
    this.setState({
      isModalOpen: true,
      modalConfig: {
        title: 'Discard Changes',
        body: (
          <span>
            Are you sure you want to discard changes on <b>{moduleName}</b>?
          </span>
        ),
        onConfirm: () => {
          this.closeModal();
          this.props.signals.editor.discardModuleChanges({
            moduleShortid: shortid,
          });
        },
      },
    });
  };

  render() {
    const {
      id,
      shortid,
      connectDropTarget, // eslint-disable-line
      isOver, // eslint-disable-line
      depth = 0,
      root,
      store,
      getModulePath,
    } = this.props;
    const { creating, isModalOpen, modalConfig, open } = this.state;
    const { currentSandbox } = store.editor;

    const title = root
      ? 'Project'
      : currentSandbox.directories.find(m => m.id === id).title;

    return connectDropTarget(
      <div style={{ position: 'relative' }}>
        <Overlay isOver={isOver} />
        {!root && (
          <EntryContainer>
            <Entry
              id={id}
              shortid={shortid}
              title={title}
              depth={depth}
              type={open ? 'directory-open' : 'directory'}
              root={root}
              isOpen={open}
              onClick={this.toggleOpen}
              renameValidator={this.validateDirectoryTitle}
              discardModuleChanges={this.confirmDiscardChanges}
              rename={!root && this.renameDirectory}
              onCreateModuleClick={this.onCreateModuleClick}
              onCreateDirectoryClick={this.onCreateDirectoryClick}
              onUploadFileClick={
                this.props.store.isLoggedIn &&
                currentSandbox.privacy === 0 &&
                this.onUploadFileClick
              }
              deleteEntry={!root && this.confirmDeleteDirectory}
              hasChildren={this.getChildren().length > 0}
              closeTree={this.closeTree}
              getModulePath={getModulePath}
            />
          </EntryContainer>
        )}
        <Opener open={open}>
          {creating === 'directory' && (
            <Entry
              id=""
              title=""
              state="editing"
              type="directory"
              depth={depth + 1}
              renameValidator={this.validateModuleTitle}
              rename={this.createDirectory}
              onRenameCancel={this.resetState}
            />
          )}
          <DirectoryChildren
            depth={depth}
            renameModule={this.renameModule}
            parentShortid={shortid}
            renameValidator={this.validateModuleTitle}
            deleteEntry={this.confirmDeleteModule}
            setCurrentModule={this.setCurrentModule}
            markTabsNotDirty={this.markTabsNotDirty}
            discardModuleChanges={this.confirmDiscardChanges}
            getModulePath={getModulePath}
          />
          <DirectoryEntryModal
            isOpen={isModalOpen}
            onClose={this.closeModal}
            {...modalConfig}
          />
          {creating === 'module' && (
            <Entry
              id=""
              title=""
              state="editing"
              depth={depth + 1}
              renameValidator={this.validateModuleTitle}
              rename={this.createModule}
              onRenameCancel={this.resetState}
            />
          )}
        </Opener>
      </div>
    );
  }
}

const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) return;

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) return;

    const sourceItem = monitor.getItem();
    if (sourceItem.dirContent) {
      sourceItem.dirContent.then(async droppedFiles => {
        const files = await getFiles(droppedFiles);

        props.signals.files.filesUploaded({
          files,
          directoryShortid: props.shortid,
        });
      });
    } else if (sourceItem.directory) {
      props.signals.files.directoryMovedToDirectory({
        shortid: sourceItem.shortid,
        directoryShortid: props.shortid,
      });
    } else {
      props.signals.files.moduleMovedToDirectory({
        moduleShortid: sourceItem.shortid,
        directoryShortid: props.shortid,
      });
    }
  },

  canDrop: (props, monitor) => {
    if (monitor == null) return false;
    const source = monitor.getItem();
    if (source == null) return false;

    if (source.id === props.id) return false;
    return true;
  },
};

function collectTarget(connectMonitor, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connectMonitor.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

export default inject('signals', 'store')(
  DropTarget(['ENTRY', NativeTypes.FILE], entryTarget, collectTarget)(
    observer(DirectoryEntry)
  )
);
