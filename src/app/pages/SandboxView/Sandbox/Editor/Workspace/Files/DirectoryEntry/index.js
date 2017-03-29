import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DropTarget } from 'react-dnd';

import Entry from './Entry';
import sandboxActionCreators
  from '../../../../../../../store/entities/sandboxes/actions';
import type {
  Module,
} from '../../../../../../../store/entities//sandboxes/modules/entity';
import type {
  Directory,
} from '../../../../../../../store/entities//sandboxes/directories/entity';
import {
  validateTitle,
} from '../../../../../../../store/entities//sandboxes/modules/validator';
import contextMenuActionCreators
  from '../../../../../../../store/context-menu/actions';

import DirectoryChildren from './DirectoryChildren';

const EntryContainer = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => props.isOver ? 'block' : 'none'};
`;

const Opener = styled.div`
  height: ${props => props.open ? '100%' : '0px'};
  overflow: hidden;
`;

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  openMenu: bindActionCreators(contextMenuActionCreators, dispatch).openMenu,
});
type Props = {
  id: string,
  sandboxId: string,
  root: ?boolean,
  title: string,
  modules: Array<Module>,
  directories: Array<Directory>,
  sandboxId: string,
  root: ?boolean,
  siblings: Array<Module | Directory>,
  depth: ?number,
  openModuleTab: (id: string) => void,
  openMenu: (e: Event) => void,
  renameSandbox: ?(title: string) => void,
  sandboxActions: typeof sandboxActionCreators,
  currentModuleId: ?string,
  isInProjectView: boolean,
};
type State = {
  creating: '' | 'module' | 'directory',
};
class DirectoryEntry extends React.PureComponent {
  props: Props;
  state: State = {
    creating: '',
    open: false,
  };

  resetState = () => this.setState({ creating: '' });

  onCreateModuleClick = () => {
    this.setState({
      creating: 'module',
      open: true,
    });
    return true;
  };

  createModule = (_, title) => {
    const { sandboxId, id, sandboxActions } = this.props;
    sandboxActions.createModule(sandboxId, title, id);
    this.resetState();
  };

  renameModule = (id, title) => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.renameModule(sandboxId, id, title);
  };

  deleteModule = (id: string) => {
    const { sandboxId, modules, sandboxActions } = this.props;
    const module = modules.find(m => m.id === id);

    const confirmed = confirm(
      `Are you sure you want to delete ${module.title}?`
    );

    if (confirmed) {
      sandboxActions.deleteModule(sandboxId, id);
    }
    return true;
  };

  onCreateDirectoryClick = () => {
    this.setState({
      creating: 'directory',
      open: true,
    });
    return true;
  };

  createDirectory = (_: string, title: string) => {
    const { sandboxId, id, sandboxActions } = this.props;
    sandboxActions.createDirectory(sandboxId, title, id);
    this.resetState();
  };

  renameDirectory = (id, title) => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.renameDirectory(sandboxId, id, title);
  };

  deleteDirectory = () => {
    const { id, title, sandboxId, sandboxActions } = this.props;

    const confirmed = confirm(
      `Are you sure you want to delete ${title} and all its children?`
    );

    if (confirmed) {
      sandboxActions.deleteDirectory(sandboxId, id);
    }
    return true;
  };

  renameSandbox = (_, newTitle) => this.props.renameSandbox(newTitle);

  toggleOpen = () => this.setOpen(!this.state.open);
  closeTree = () => this.setOpen(false);
  setOpen = open => this.setState({ open });

  validateModuleTitle = (_, title) => {
    const { directories, modules, id } = this.props;
    return validateTitle(id, title, [...directories, ...modules]);
  };

  validateDirectoryTitle = (id, title) => {
    const { root, siblings } = this.props;
    if (root) return false;

    return validateTitle(id, title, siblings);
  };

  getChildren = () => {
    const { modules, directories, id } = this.props;

    return [
      ...modules.filter(m => m.directoryShortid === id),
      ...directories.filter(d => d.directoryShortid === id),
    ];
  };

  setCurrentModule = (moduleId: string) => {
    const { sandboxId, sandboxActions } = this.props;
    sandboxActions.setCurrentModule(sandboxId, moduleId);
  };

  render() {
    const {
      id,
      sandboxId,
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
    } = this.props;
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
            rename={!root && this.renameDirectory}
            onCreateModuleClick={this.onCreateModuleClick}
            onCreateDirectoryClick={this.onCreateDirectoryClick}
            deleteEntry={!root && this.deleteDirectory}
            hasChildren={this.getChildren().length > 0}
            openMenu={openMenu}
            closeTree={this.closeTree}
          />
        </EntryContainer>
        <Opener open={open}>
          {creating === 'directory' &&
            <Entry
              id=""
              title=""
              state="editing"
              type="directory"
              depth={depth + 1}
              renameValidator={this.validateModuleTitle}
              rename={this.createDirectory}
              onRenameCancel={this.resetState}
            />}
          <DirectoryChildren
            modules={modules}
            directories={directories}
            depth={depth}
            renameModule={this.renameModule}
            openMenu={openMenu}
            sandboxId={sandboxId}
            parentId={id}
            deleteEntry={this.deleteModule}
            setCurrentModule={this.setCurrentModule}
            currentModuleId={currentModuleId}
            isInProjectView={isInProjectView}
          />
          {creating === 'module' &&
            <Entry
              id=""
              title=""
              state="editing"
              depth={depth + 1}
              renameValidator={this.validateModuleTitle}
              rename={this.createModule}
              onRenameCancel={this.resetState}
            />}
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
      props.sandboxActions.moveDirectoryToDirectory(
        props.sandboxId,
        sourceItem.id,
        props.id
      );
    } else {
      props.sandboxActions.moveModuleToDirectory(
        props.sandboxId,
        sourceItem.id,
        props.id
      );
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

export default connect(null, mapDispatchToProps)(
  DropTarget('ENTRY', entryTarget, collectTarget)(DirectoryEntry)
);
