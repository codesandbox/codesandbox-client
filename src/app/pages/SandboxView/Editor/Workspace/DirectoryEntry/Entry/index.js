// @flow
import React from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';

import FileIcon from 'react-icons/lib/fa/file';
import FolderIcon from 'react-icons/lib/fa/folder';
import EditIcon from 'react-icons/lib/go/pencil';
import DeleteIcon from 'react-icons/lib/go/trashcan';

import theme from '../../../../../../../common/theme';

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
  renameValidator: (title: string) => boolean;
  rename: (id: string, title: string) => boolean;
  deleteEntry: (id: string) => void;
  onRenameCancel: () => void;
  state?: '' | 'editing' | 'creating';
  isOpen?: boolean;
  onClick: Function;
  openMenu: Function;
  closeTree?: () => void;
  hasChildren?: boolean;
};

type State = {
  state: '' | 'editing' | 'creating';
  error: boolean;
  selected: boolean;
};

const getContainerStyles = (props) => {
  let styles = `
    transition: 0.3s ease all;
    position: relative;
    display: flex;
    font-size: 14px;
    padding: 0.6rem;
    padding-left: ${props.depth + 1.5}rem;
    color: ${props.theme.background.lighten(2)()};
    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;
    cursor: pointer;
    user-select: none;

    &:hover {
      ${props.active || props.editing ? '' : `
        background-color: ${theme.background3.darken(0.2)()};
        color: ${theme.background.lighten(5)()};
        border-color: ${theme.primary.darken(0.4)()};
      `}

      > div {
        opacity: 1; !important
      }
    }
  `;

  if (props.editing) {
    styles += `
      color: ${theme.white()};
      background-color: ${theme.background3.darken(0.15)()};
    `;

    if (props.nameValidationError) {
      styles += `
        border-color: ${theme.red()} !important;
        background-color: ${theme.redBackground.clearer(0.4)()} !important;
      `;
    }
  }

  if (props.active) {
    styles += `
      color: ${theme.white()} !important;
      border-color: ${theme.primary()} !important;
      background-color: ${theme.background3()} !important;
    `;
  }

  return styles;
};
const ModuleContainer = styled.span`
  ${props => getContainerStyles(props)}
`;

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
    const isInvalidTitle = this.props.renameValidator(title);
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
      connectDragSource, onClick, isNotSynced } = this.props;
    const { state, error, selected } = this.state;
    return connectDragSource(
      <div>
        <ModuleContainer
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
          />
          {state === 'editing' ?
            <EntryTitleInput
              title={title}
              onChange={this.handleValidateTitle}
              onCancel={this.resetState}
              onCommit={this.handleRename}
            />
          : <EntryTitle title={title} />}
        </ModuleContainer>
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
