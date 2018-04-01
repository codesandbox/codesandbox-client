import * as React from 'react';
import { DragSource } from 'react-dnd';
import ContextMenu from 'app/components/ContextMenu';

import FileIcon from 'react-icons/lib/fa/file';
import FolderIcon from 'react-icons/lib/fa/folder';
import EditIcon from 'react-icons/lib/go/pencil';
import DeleteIcon from 'react-icons/lib/go/trashcan';

import theme from 'common/theme';

import { EntryContainer } from '../../../elements';
import EntryTitle from './EntryTitle';
import EntryTitleInput from './EntryTitleInput';
import EntryIcons from './EntryIcons';
import EditIcons from './EditIcons';

import { Right, NotSyncedIconWithMargin } from './elements';

class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      state: props.state || '',
      error: false,
      selected: false,
      hovering: false,
    };
  }

  resetState = () => {
    if (this.props.onRenameCancel) {
      this.props.onRenameCancel();
    }
    this.setState({ state: '', error: false });
  };

  handleValidateTitle = title => {
    const isInvalidTitle = this.props.renameValidator(this.props.id, title);
    this.setState({ error: isInvalidTitle });
  };

  handleRename = (title, force) => {
    const { shortid } = this.props;
    const canRename = !this.handleValidateTitle(title);
    if (canRename && this.props.rename) {
      this.props.rename(shortid, title);
      this.resetState();
    } else if (force) this.resetState();
  };

  delete = () => {
    const { shortid, title, deleteEntry } = this.props;
    if (deleteEntry) {
      return deleteEntry(shortid, title);
    }
    return false;
  };

  rename = () => {
    this.setState({ state: 'editing' });
    return true; // To close it
  };

  setCurrentModule = () => this.props.setCurrentModule(this.props.id);

  onMouseEnter = () => this.setState({ hovering: true });
  onMouseLeave = () => this.setState({ hovering: false });

  render() {
    const {
      title,
      depth,
      isOpen,
      hasChildren,
      type,
      active,
      setCurrentModule,
      connectDragSource, // eslint-disable-line
      onCreateModuleClick,
      onCreateDirectoryClick,
      deleteEntry,
      onClick,
      markTabsNotDirty,
      rename,
      isNotSynced,
      isMainModule,
      moduleHasError,
      root,
      rightColors,
    } = this.props;
    const { state, error, selected, hovering } = this.state;

    const items = [
      onCreateModuleClick && {
        title: 'New Module',
        action: onCreateModuleClick,
        icon: FileIcon,
      },
      onCreateDirectoryClick && {
        title: 'New Directory',
        action: onCreateDirectoryClick,
        icon: FolderIcon,
      },
      rename && {
        title: 'Rename',
        action: this.rename,
        icon: EditIcon,
      },
      deleteEntry && {
        title: 'Delete',
        action: this.delete,
        color: theme.red.darken(0.2)(),
        icon: DeleteIcon,
      },
    ].filter(x => x);

    return connectDragSource(
      <div>
        <ContextMenu items={items}>
          <EntryContainer
            onClick={setCurrentModule ? this.setCurrentModule : onClick}
            onDoubleClick={markTabsNotDirty}
            depth={depth}
            nameValidationError={error}
            active={active}
            editing={state === 'editing' || selected}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            alternative={isMainModule}
            rightColors={rightColors}
            noTransition
          >
            <EntryIcons
              isNotSynced={isNotSynced}
              hasChildren={hasChildren}
              isOpen={isOpen}
              type={type}
              root={root}
              error={moduleHasError}
            />
            {state === 'editing' ? (
              <EntryTitleInput
                title={title}
                onChange={this.handleValidateTitle}
                onCancel={this.resetState}
                onCommit={this.handleRename}
              />
            ) : (
              <EntryTitle title={title} />
            )}
            {isNotSynced && !state && <NotSyncedIconWithMargin />}
            {state === '' && (
              <Right>
                {isMainModule ? (
                  <span style={{ opacity: hovering ? 1 : 0 }}>main</span>
                ) : (
                  <EditIcons
                    hovering={hovering}
                    onCreateFile={onCreateModuleClick}
                    onCreateDirectory={onCreateDirectoryClick}
                    onDelete={deleteEntry && this.delete}
                    onEdit={rename && this.rename}
                    active={active}
                  />
                )}
              </Right>
            )}
          </EntryContainer>
        </ContextMenu>
      </div>
    );
  }
}

const entrySource = {
  canDrag: props => !!props.id && !props.isMainModule,
  beginDrag: props => {
    if (props.closeTree) props.closeTree();
    return {
      id: props.id,
      shortid: props.shortid,
      directory: props.type === 'directory' || props.type === 'directory-open',
    };
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource('ENTRY', entrySource, collectSource)(Entry);
