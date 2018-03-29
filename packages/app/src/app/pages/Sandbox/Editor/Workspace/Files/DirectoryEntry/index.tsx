import * as React from 'react';
import { connect } from 'app/fluent';
import { DropTarget, ConnectDropTarget } from 'react-dnd';
import Modal from 'app/components/Modal';
import Alert from 'app/components/Alert';
import { Module, Directory, SandboxError, Correction } from 'app/store/modules/editor/types'

import validateTitle from './validateTitle';
import Entry from './Entry';
import DirectoryChildren from './DirectoryChildren';
import getModuleParents from './getModuleParents';
import { EntryContainer, Overlay, Opener } from './elements';

const entryTarget = {
  drop: (props, monitor) => {
    if (monitor == null) {
      return
    };

    // Check if only child is selected:
    if (!monitor.isOver({ shallow: true })) {
      return
    }

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
    if (monitor == null) {
      return false
    }
    const source = monitor.getItem();

    if (source == null) {
      return false
    }

    if (source.id === props.id) {
      return false
    }
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

type Props = {
  id: string
  shortid: string
  modules: Module[]
  directories: Directory[]
  currentModuleId: string
  root?: boolean
  sandboxId: string
  sandboxTemplate: string
  title: string
  connectDropTarget?: ConnectDropTarget
  isOver?: boolean
  isInProjectView: boolean
  depth: number
  mainModuleId: string
  errors: SandboxError[]
  corrections: Correction[]
  changedModuleShortids: string[]
  openMenu?: () => void
  innerRef?: (component: React.Component) => void
  markTabsNotDirty?: () => void
}

type State = {
  creating: string
  open: boolean
  showDeleteDirectoryModal: boolean
  showDeleteModuleModal: boolean
  moduleToDeleteTitle: string
  moduleToDeleteShortid: string
}

export default connect<Props>()
  .with(({ signals }) => ({
    moduleCreated: signals.files.moduleCreated,
    moduleRenamed: signals.files.moduleRenamed,
    directoryRenamed: signals.files.directoryRenamed,
    directoryCreated: signals.files.directoryCreated,
    moduleSelected: signals.files.moduleSelected,
    moduleDoubleClicked: signals.files.moduleDoubleClicked,
    directoryDeleted: signals.files.directoryDeleted,
    moduleDeleted: signals.files.moduleDeleted
  }))
  .toClass(allProps =>
    DropTarget('ENTRY', entryTarget, collectTarget)(
      class DirectoryEntry extends React.Component<typeof allProps, State> {
        constructor(props) {
          super(props);

          const { id, modules, directories, currentModuleId } = this.props;
          const currentModuleParents = getModuleParents(
            modules,
            directories,
            currentModuleId
          );

          const isParentOfModule = currentModuleParents.indexOf(id) >= 0

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
            this.props.currentModuleId !== nextProps.currentModuleId
          ) {
            const { id, modules, directories, currentModuleId } = nextProps;
            const currentModuleParents = getModuleParents(
              modules,
              directories,
              currentModuleId
            );

            const isParentOfModule = currentModuleParents.indexOf(id) >= 0
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
          this.props.moduleCreated({
            title,
            directoryShortid: shortid,
          });
          this.resetState();
        };

        renameModule = (moduleShortid, title) => {
          this.props.moduleRenamed({ moduleShortid, title });
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
          this.props.directoryCreated({
            title,
            directoryShortid: shortid,
          });
          this.resetState();
        };

        renameDirectory = (directoryShortid, title) => {
          this.props.directoryRenamed({ title, directoryShortid });
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
          const { id } = this.props;
          return validateTitle(id, title);
        };

        validateDirectoryTitle = (id, title) => {
          const { root } = this.props;
          if (root) {
            return false
          }

          return validateTitle(id, title);
        };

        getChildren = () => {
          const { modules, directories, shortid } = this.props;

          return [
            ...modules.filter(m => m.directoryShortid === shortid),
            ...directories.filter(d => d.directoryShortid === shortid),
          ];
        };

        setCurrentModule = moduleId => {
          this.props.moduleSelected({ id: moduleId });
        };

        markTabsNotDirty = () => {
          this.props.moduleDoubleClicked();
        };

        render() {
          const {
            id,
            shortid,
            sandboxId,
            sandboxTemplate,
            modules,
            directories,
            title,
            openMenu,
            currentModuleId,
            connectDropTarget,
            isOver,
            isInProjectView,
            depth = 0,
            root,
            mainModuleId,
            errors,
            corrections,
            changedModuleShortids,
          } = this.props;
          const { creating, open } = this.state;

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
                    openMenu={openMenu}
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
                        this.props.directoryDeleted({
                          moduleShortid: shortid,
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
                  modules={modules}
                  directories={directories}
                  depth={depth}
                  renameModule={this.renameModule}
                  openMenu={openMenu}
                  sandboxId={sandboxId}
                  mainModuleId={mainModuleId}
                  sandboxTemplate={sandboxTemplate}
                  parentShortid={shortid}
                  deleteEntry={this.deleteModule}
                  setCurrentModule={this.setCurrentModule}
                  currentModuleId={currentModuleId}
                  isInProjectView={isInProjectView}
                  markTabsNotDirty={this.markTabsNotDirty}
                  errors={errors}
                  corrections={corrections}
                  changedModuleShortids={changedModuleShortids}
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
                      this.props.moduleDeleted({
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
    )
  )
