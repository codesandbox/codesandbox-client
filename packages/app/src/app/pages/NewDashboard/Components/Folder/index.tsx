import React from 'react';
import { join, dirname } from 'path';
import { useLocation } from 'react-router-dom';
import { isMenuClicked } from '@codesandbox/components';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { FolderCard } from './FolderCard';
import { FolderListItem } from './FolderListItem';

export const Folder = ({ name = '', path = '', sandboxes = 0, ...props }) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  /* Edit logic */
  const [editing, setEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(name);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewName(name);
      setEditing(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    // if (newFolder) {
    //   return newFolder(newName);
    // }

    await actions.dashboard.renameFolder({
      path,
      newPath: join(dirname(path), newName),
    });

    return setEditing(false);
  };

  const onBlur = () => {
    // save value when you click outside or tab away
    onSubmit();
  };

  const inputRef = React.useRef(null);
  const enterEditing = () => {
    setEditing(true);
    // Menu defaults to sending focus back to Menu Button
    // Send focus to input in the next tick
    // after menu is done closing.
    setTimeout(() => inputRef.current.focus());
  };

  /* Prevent opening sandbox while interacting */
  const onClick = event => {
    if (editing || isMenuClicked(event)) event.preventDefault();
  };

  const folderProps = {
    name,
    path,
    numberOfSandboxes: sandboxes,
    onClick,
    // edit mode
    editing,
    enterEditing,
    newName,
    inputRef,
    onChange,
    onKeyDown,
    onSubmit,
    onBlur,
  };

  /* Drag logic */

  const dragProps = {
    opacity: 1,
  };

  // React.useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, [preview]);

  /* View logic */
  const location = useLocation();

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? FolderListItem : FolderCard;

  return (
    <>
      <Component {...folderProps} {...dragProps} {...props} />
    </>
  );
};
