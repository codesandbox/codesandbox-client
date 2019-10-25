import { inject, observer } from 'app/componentConnectors';
import { Alert } from 'app/components/Alert';
import Modal from 'app/components/Modal';
import { reaction } from 'mobx';
import React from 'react';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { getChildren } from '@codesandbox/common/lib/sandbox/modules';

import DirectoryChildren from './DirectoryChildren';
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
      showDeleteDirectoryModal: false,
      showDeleteModuleModal: false,
      moduleToDeleteTitle: null,
      moduleToDeleteShortid: null,
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

  deleteModule = (shortid, title) => {
    this.setState({
      showDeleteModuleModal: true,
      moduleToDeleteShortid: shortid,
      moduleToDeleteTitle: title,
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

  closeModals = () => {
    this.setState({
      showDeleteDirectoryModal: false,
      showDeleteModuleModal: false,
    });
  };

  deleteDirectory = () => {
    this.setState({
      showDeleteDirectoryModal: true,
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

  discardChanges = moduleShortid => {
    this.props.signals.editor.discardModuleChanges({ moduleShortid });

    return true;
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
    const { creating, open } = this.state;
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
              discardModuleChanges={this.discardChanges}
              rename={!root && this.renameDirectory}
              onCreateModuleClick={this.onCreateModuleClick}
              onCreateDirectoryClick={this.onCreateDirectoryClick}
              onUploadFileClick={
                this.props.store.isLoggedIn &&
                currentSandbox.privacy === 0 &&
                this.onUploadFileClick
              }
              deleteEntry={!root && this.deleteDirectory}
              hasChildren={this.getChildren().length > 0}
              closeTree={this.closeTree}
              getModulePath={getModulePath}
            />
            {this.state.showDeleteDirectoryModal && (
              <Modal
                isOpen={this.state.showDeleteDirectoryModal}
                onClose={this.closeModals}
                width={400}
              >
                <Alert
                  title="Delete Directory"
                  body={
                    <span>
                      Are you sure you want to delete <b>{title}</b>?
                      <br />
                      The directory will be permanently removed.
                    </span>
                  }
                  onCancel={this.closeModals}
                  onConfirm={() => {
                    this.setState({
                      showDeleteDirectoryModal: false,
                    });
                    this.props.signals.files.directoryDeleted({
                      directoryShortid: shortid,
                    });
                  }}
                />
              </Modal>
            )}
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
            deleteEntry={this.deleteModule}
            setCurrentModule={this.setCurrentModule}
            markTabsNotDirty={this.markTabsNotDirty}
            discardModuleChanges={this.discardChanges}
            getModulePath={getModulePath}
          />
          {this.state.showDeleteModuleModal && (
            <Modal
              isOpen={this.state.showDeleteModuleModal}
              onClose={this.closeModals}
              width={400}
            >
              <Alert
                css={`
                  background-color: ${props =>
                    props.theme['sideBar.background'] || 'auto'};
                  color: ${props =>
                    props.theme.light
                      ? 'rgba(0,0,0,0.9)'
                      : 'rgba(255,255,255,0.9)'};
                `}
                title="Delete File"
                body={
                  <span>
                    Are you sure you want to delete{' '}
                    <b
                      css={`
                        word-break: break-all;
                      `}
                    >
                      {this.state.moduleToDeleteTitle}
                    </b>
                    ?
                    <br />
                    The file will be permanently removed.
                  </span>
                }
                onCancel={this.closeModals}
                onConfirm={() => {
                  this.setState({
                    showDeleteModuleModal: false,
                  });
                  this.props.signals.files.moduleDeleted({
                    moduleShortid: this.state.moduleToDeleteShortid,
                  });
                }}
              />
            </Modal>
          )}
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
