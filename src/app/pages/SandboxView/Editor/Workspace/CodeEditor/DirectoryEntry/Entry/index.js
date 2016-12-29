// @flow
import React from 'react';
import { DragSource } from 'react-dnd';

import FileIcon from 'react-icons/lib/fa/file';
import FolderIcon from 'react-icons/lib/fa/folder';
import EditIcon from 'react-icons/lib/go/pencil';
import DeleteIcon from 'react-icons/lib/go/trashcan';

import theme from '../../../../../../../../common/theme';

import EntryContainer from '../../../EntryContainer';
import EntryTitle from './EntryTitle';
import EntryTitleInput from './EntryTitleInput';
import EntryIcons from './EntryIcons';

type Props = {
  id: string;
  title: string;
  depth: number;
  active: boolean;
  isNotSynced: boolean;
  type: string;
  onCreateModuleClick?: () => void;
  onCreateDirectoryClick?: () => void;
  renameValidator: (id: string, title: string) => boolean;
  rename: (id: string, title: string) => boolean;
  deleteEntry: (id: string) => void;
  onRenameCancel: () => void;
  state?: '' | 'editing' | 'creating';
  isOpen?: boolean;
  onClick: Function;
  openMenu: Function;
  closeTree?: () => void;
  hasChildren?: boolean;
  root: ?boolean;
};

type State = {
  state: '' | 'editing' | 'creating';
  error: boolean;
  selected: boolean;
};

class Entry extends React.PureComponent {
  constructor(props: Props) {
    super(props);
    this.state = {
      state: props.state || '',
      error: false,
      selected: false,
    };
  }

  resetState = () => {
    if (this.props.onRenameCancel) {
      this.props.onRenameCancel();
    }
    this.setState({ state: '', error: false });
  }

  handleValidateTitle = (title: string) => {
    const isInvalidTitle = this.props.renameValidator(this.props.id, title);
    this.setState({ error: isInvalidTitle });
  };

  handleRename = (title: string, force: ?boolean) => {
    const { id } = this.props;
    const canRename = !this.handleValidateTitle(title);
    if (canRename) {
      this.props.rename(id, title);
      this.resetState();
    } else if (force) this.resetState();
  };

  openContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({
      selected: true,
    });

    const { id, onCreateModuleClick, onCreateDirectoryClick, rename, deleteEntry } = this.props;
    const items = [onCreateModuleClick && {
      title: 'New Module',
      action: onCreateModuleClick,
      icon: FileIcon,
    }, onCreateDirectoryClick && {
      title: 'New Directory',
      action: onCreateDirectoryClick,
      icon: FolderIcon,
    }, rename && {
      title: 'Rename',
      action: () => {
        this.setState({ state: 'editing' });
        return true; // To close it
      },
      icon: EditIcon,
    }, deleteEntry && {
      title: 'Delete',
      action: () => deleteEntry(id),
      color: theme.red.darken(0.2)(),
      icon: DeleteIcon,
    }].filter(x => x);
    this.props.openMenu(items, event.clientX, event.clientY, () => {
      this.setState({ selected: false });
    });
  }

  props: Props;
  state: State;

  render() {
    const { title, depth, isOpen, hasChildren, type, active,
      connectDragSource, onClick, isNotSynced, root } = this.props;
    const { state, error, selected } = this.state;
    return connectDragSource(
      <div>
        <EntryContainer
          onClick={onClick}
          depth={depth}
          nameValidationError={error}
          active={active}
          editing={state === 'editing' || selected}
          onContextMenu={this.openContextMenu}
        >
          <EntryIcons
            isNotSynced={isNotSynced}
            hasChildren={hasChildren}
            isOpen={isOpen}
            type={type}
            root={root}
          />
          {state === 'editing' ?
            <EntryTitleInput
              title={title}
              onChange={this.handleValidateTitle}
              onCancel={this.resetState}
              onCommit={this.handleRename}
            />
          : <EntryTitle title={title} />}
        </EntryContainer>
      </div>,
    );
  }
}

const entrySource = {
  canDrag: props => !!props.id,
  beginDrag: (props) => {
    if (props.closeTree) props.closeTree();
    return { id: props.id, directory: props.type === 'directory' };
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});


export default DragSource('ENTRY', entrySource, collectSource)(Entry);
