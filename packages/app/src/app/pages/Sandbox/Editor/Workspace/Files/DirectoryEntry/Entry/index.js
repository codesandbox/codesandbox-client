import * as React from 'react';
import { DragSource } from 'react-dnd';
import ContextMenu from 'app/components/ContextMenu';

import AddFileIcon from 'react-icons/lib/md/insert-drive-file';
import AddDirectoryIcon from 'react-icons/lib/md/create-new-folder';
import EditIcon from 'react-icons/lib/go/pencil';
import DeleteIcon from 'react-icons/lib/go/trashcan';
import UploadFileIcon from 'react-icons/lib/md/file-upload';

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

  handleRename = (newTitle, force) => {
    const { shortid, title, rename } = this.props;

    if (newTitle === title) {
      this.resetState();
      return;
    }

    const canRename = !this.handleValidateTitle(newTitle);

    if (newTitle !== title && canRename && rename) {
      rename(shortid, newTitle);
      this.resetState();
    } else if (force) {
      this.resetState();
    }
  };

  delete = () => {
    const { shortid, title, deleteEntry } = this.props;
    if (deleteEntry) {
      return deleteEntry(shortid, title);
    }
    return false;
  };

  discardModuleChanges = () => {
    const { shortid, discardModuleChanges } = this.props;

    if (discardModuleChanges) {
      return discardModuleChanges(shortid);
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
      onUploadFileClick,
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
      [
        isNotSynced && {
          title: 'Discard Changes',
          action: this.discardModuleChanges,
        },
      ].filter(Boolean),
      [
        onCreateModuleClick && {
          title: 'Create File',
          action: onCreateModuleClick,
          icon: AddFileIcon,
        },
        onCreateDirectoryClick && {
          title: 'Create Directory',
          action: onCreateDirectoryClick,
          icon: AddDirectoryIcon,
        },
        onUploadFileClick && {
          title: 'Upload Files',
          action: onUploadFileClick,
          icon: UploadFileIcon,
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
      ].filter(Boolean),
    ].filter(Boolean);

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
                {isMainModule && (
                  <span
                    style={{
                      fontSize: '.75rem',
                      fontWeight: 600,
                      opacity: hovering ? 0.6 : 0,
                      marginTop: 3,
                      marginRight: 3,
                    }}
                  >
                    entry
                  </span>
                )}
                <EditIcons
                  hovering={hovering}
                  onCreateFile={onCreateModuleClick}
                  onCreateDirectory={onCreateDirectoryClick}
                  onUploadFile={onUploadFileClick}
                  onDelete={deleteEntry && this.delete}
                  onEdit={rename && this.rename}
                  active={active}
                  forceShow={window.__isTouch && type === 'directory-open'}
                />
              </Right>
            )}
          </EntryContainer>
        </ContextMenu>
      </div>
    );
  }
}

const entrySource = {
  canDrag: props => !!props.id,
  beginDrag: props => {
    if (props.closeTree) props.closeTree();

    const directory =
      props.type === 'directory' || props.type === 'directory-open';
    return {
      id: props.id,
      shortid: props.shortid,
      directory,
      path: !directory && props.getModulePath(props.id),
    };
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DragSource('ENTRY', entrySource, collectSource)(Entry);
