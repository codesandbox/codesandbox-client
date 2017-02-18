import React from 'react';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropTarget } from 'react-dnd';

import Entry from './Entry';
import moduleEntity from '../../../../../../store/entities/modules/';
import directoryEntity from '../../../../../../store/entities/directories/';
import type { Module } from '../../../../../../store/entities/modules';
import type { Directory } from '../../../../../../store/entities/directories';
import { validateTitle } from '../../../../../../store/entities/modules/validator';
import contextMenuActionCreators from '../../../../../../store/actions/context-menu';
import sandboxViewActions from '../../../../../../store/actions/views/sandbox';

import { directoriesInDirectorySelector } from '../../../../../../store/entities/directories/selector';
import { modulesInDirectorySelector, currentModuleSelector } from '../../../../../../store/entities/modules/selector';

import DirectoryChildren from './DirectoryChildren';

const EntryContainer = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => (props.isOver ? 'block' : 'none')};
`;

const Opener = styled.div`
  height: ${props => (props.open ? '100%' : '0px')};
  overflow: hidden;
`;

const mapStateToProps = createSelector(
  directoriesInDirectorySelector,
  modulesInDirectorySelector,
  currentModuleSelector,
  (directories, modules, currentModule) => ({
    directories,
    modules,
    currentModuleId: currentModule ? currentModule.id : null,
  }),
);
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  directoryActions: bindActionCreators(directoryEntity.actions, dispatch),
  openModuleTab: bindActionCreators(sandboxViewActions, dispatch).openModuleTab,
  openMenu: bindActionCreators(contextMenuActionCreators, dispatch).openMenu,
});
type Props = {
  id: string;
  sandboxId: string;
  root: ?boolean;
  title: string;
  open: boolean;
  sourceId: string;
  root?: boolean;
  directories: Array<Directory>;
  modules: Array<Module>;
  siblings: Array<Module | Directory>;
  depth: ?number;
  openModuleTab: (id: string) => void;
  moduleActions: typeof moduleEntity.actions;
  directoryActions: typeof directoryEntity.actions;
  openMenu: (e: Event) => void;
  renameSandbox?: (title: string) => void;
  currentModuleId: ?string;
};
type State = {
  creating: '' | 'module' | 'directory';
};
class DirectoryEntry extends React.PureComponent {
  props: Props;
  state: State = {
    creating: '',
    open: true, // TODO move this permanently to store
  };

  resetState = () => this.setState({ creating: '' });

  onCreateModuleClick = () => {
    const { id, directoryActions } = this.props;
    directoryActions.setOpen(id, true);
    this.setState({
      creating: 'module',
      open: true,
    });
    return true;
  };

  createModule = (_, title) => {
    const { id, sourceId, moduleActions } = this.props;
    moduleActions.createModule(title, sourceId, id);
    this.resetState();
  };

  onCreateDirectoryClick = () => {
    const { id, directoryActions } = this.props;
    directoryActions.setOpen(id, true);
    this.setState({
      creating: 'directory',
      open: true,
    });
    return true;
  };

  createDirectory = (_, title) => {
    const { id, sourceId, directoryActions } = this.props;
    directoryActions.createDirectory(title, sourceId, id);
    this.resetState();
  };

  deleteDirectory = () => {
    const { id, title, directoryActions } = this.props;
    const confirmed = confirm(`Are you sure you want to delete ${title} and all its children?`);

    if (confirmed) {
      directoryActions.deleteDirectory(id);
    }
    return true;
  };

  deleteModule = (id: string) => {
    const { modules, moduleActions } = this.props;
    const module = modules.find(m => m.id === id);

    const confirmed = confirm(`Are you sure you want to delete ${module.title}?`);
    if (confirmed) {
      moduleActions.deleteModule(id);
    }
    return true;
  };

  renameSandbox = (_, newTitle) => this.props.renameSandbox(newTitle);

  toggleOpen = () => this.setOpen(!this.state.open);
  closeTree = () => this.setOpen(false);
  setOpen = open => this.setState({ open });

  validateModuleTitle = (_, title) => {
    const { id, directories, modules } = this.props;
    return validateTitle(id, title, [...directories, ...modules]);
  };

  validateDirectoryTitle = (id, title) => {
    const { root, siblings } = this.props;
    if (root) return false;

    return validateTitle(id, title, siblings);
  };

  render() {
    const { id, sandboxId, title, directories, openMenu, modules, moduleActions, openModuleTab,
      currentModuleId, directoryActions,
      connectDropTarget, isOver, sourceId, depth = 0, root } = this.props;
    const { creating, open } = this.state;
    return connectDropTarget(
      <div style={{ position: 'relative' }}>
        <Overlay isOver={isOver} />
        <EntryContainer>
          <Entry
            id={id}
            title={title}
            depth={depth}
            type="directory"
            root={root}
            isOpen={open}
            onClick={this.toggleOpen}
            renameValidator={this.validateDirectoryTitle}
            rename={root
              ? this.renameSandbox
              : directoryActions.renameDirectory
            }
            onCreateModuleClick={this.onCreateModuleClick}
            onCreateDirectoryClick={this.onCreateDirectoryClick}
            deleteEntry={!root && this.deleteDirectory}
            hasChildren={directories.length + modules.length > 0}
            openMenu={openMenu}
            closeTree={this.closeTree}
          />
        </EntryContainer>
        <Opener open={open == null ? true : open}>
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
            renameModule={moduleActions.renameModule}
            openMenu={openMenu}
            sandboxId={sandboxId}
            sourceId={sourceId}
            deleteEntry={this.deleteModule}
            openModuleTab={openModuleTab}
            currentModuleId={currentModuleId}
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
      </div>,
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
      props.directoryActions.moveToDirectory(sourceItem.id, props.id);
    } else {
      props.moduleActions.moveToDirectory(sourceItem.id, props.id);
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

function collectTarget(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DropTarget('ENTRY', entryTarget, collectTarget)(DirectoryEntry),
);
