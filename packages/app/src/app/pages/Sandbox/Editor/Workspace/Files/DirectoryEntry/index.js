import React from 'react';
import { inject, observer } from 'mobx-react';
import { DropTarget } from 'react-dnd';
import Modal from 'app/components/Modal';
import Alert from 'app/components/Alert';

import validateTitle from './validateTitle';
import Entry from './Entry';
import DirectoryChildren from './DirectoryChildren';
import getModuleParents from './getModuleParents';
import { EntryContainer, Overlay, Opener } from './elements';

class DirectoryEntry extends React.Component {
  constructor(props) {
    super(props);

    const { id, store } = this.props;
    const { modules, directories } = store.editor.currentSandbox;
    const currentModuleId = store.editor.currentModule.id;
    const currentModuleParents = getModuleParents(
      modules,
      directories,
      currentModuleId
    );

    const isParentOfModule = currentModuleParents.includes(id);

    this.state = {
      creating: '',
      open: props.root || isParentOfModule,
      showDeleteDirectoryModal: false,
      showDeleteModuleModal: false,
      moduleToDeleteTitle: null,
      moduleToDeleteShortid: null,
    };
  }

  componentDidMount() {
    if (this.props.innerRef) {
      this.props.innerRef(this);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (
      !nextState.open &&
      this.props.store.editor.currentModule !==
        nextProps.store.editor.currentModule
    ) {
      const { id, store } = nextProps;
      const { modules, directories } = store.editor.currentSandbox;
      const currentModuleId = store.editor.currentModule.id;
      const currentModuleParents = getModuleParents(
        modules,
        directories,
        currentModuleId
      );

      const isParentOfModule = currentModuleParents.includes(id);
      if (isParentOfModule) {
        this.setState({ open: isParentOfModule });
      }
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

  validateModuleTitle = (_, title) => {
    const { store, id } = this.props;
    const { directories, modules } = store.editor.currentSandbox;
    return validateTitle(id, title, [...directories, ...modules]);
  };

  validateDirectoryTitle = (id, title) => {
    const { root, siblings } = this.props;
    if (root) return false;

    return validateTitle(id, title, siblings);
  };

  getChildren = () => {
    const { shortid } = this.props;

    return [
      ...this.props.store.editor.currentSandbox.modules.filter(
        m => m.directoryShortid === shortid
      ),
      ...this.props.store.editor.currentSandbox.directories.filter(
        d => d.directoryShortid === shortid
      ),
    ];
  };

  setCurrentModule = moduleId => {
    this.props.signals.editor.moduleSelected({ id: moduleId });
  };

  markTabsNotDirty = () => {
    this.props.signals.editor.moduleDoubleClicked();
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
    } = this.props;
    const { creating, open } = this.state;
    const currentSandbox = store.editor.currentSandbox;

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
              rename={!root && this.renameDirectory}
              onCreateModuleClick={this.onCreateModuleClick}
              onCreateDirectoryClick={this.onCreateDirectoryClick}
              deleteEntry={!root && this.deleteDirectory}
              hasChildren={this.getChildren().length > 0}
              closeTree={this.closeTree}
            />
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
                onDelete={() => {
                  this.setState({
                    showDeleteDirectoryModal: false,
                  });
                  this.props.signals.files.directoryDeleted({
                    directoryShortid: shortid,
                  });
                }}
              />
            </Modal>
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
            deleteEntry={this.deleteModule}
            setCurrentModule={this.setCurrentModule}
            markTabsNotDirty={this.markTabsNotDirty}
          />
          <Modal
            isOpen={this.state.showDeleteModuleModal}
            onClose={this.closeModals}
            width={400}
          >
            <Alert
              title="Delete File"
              body={
                <span>
                  Are you sure you want to delete{' '}
                  <b>{this.state.moduleToDeleteTitle}</b>?
                  <br />
                  The file will be permanently removed.
                </span>
              }
              onCancel={this.closeModals}
              onDelete={() => {
                this.setState({
                  showDeleteModuleModal: false,
                });
                this.props.signals.files.moduleDeleted({
                  moduleShortid: this.state.moduleToDeleteShortid,
                });
              }}
            />
          </Modal>
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

    if (sourceItem.directory) {
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
  DropTarget('ENTRY', entryTarget, collectTarget)(observer(DirectoryEntry))
);
