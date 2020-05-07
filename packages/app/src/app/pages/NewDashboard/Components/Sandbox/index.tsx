import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { isMenuClicked } from '@codesandbox/components';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SandboxListItem, SkeletonListItem } from './SandboxListItem';

export const Sandbox = ({ sandbox, isTemplate = false, ...props }) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;

  const [edit, setEdit] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(sandboxTitle);

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  /* Edit logic */

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewTitle(sandboxTitle);
      setEdit(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    await actions.dashboard.renameSandbox({
      id: sandbox.id,
      title: newTitle,
      oldTitle: sandboxTitle,
    });
    setEdit(false);
  };

  const onBlur = () => {
    // save value when you click outside or tab away
    onSubmit();
  };

  const inputRef = React.useRef(null);
  const enterEditing = () => {
    setEdit(true);
    // Menu defaults to sending focus back to Menu Button
    // Send focus to input in the next tick
    // after menu is done closing.
    setTimeout(() => inputRef.current.focus());
  };

  /* Drag logic */

  const [dragging, setDragging] = React.useState(false);

  const onDragStart = () => {
    setDragging(true);
  };

  const onDragEnd = () => {
    // delay by a frame so that click happens first
    window.requestAnimationFrame(() => setDragging(false));
  };

  /* View logic */
  const location = useLocation();

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? SandboxListItem : SandboxCard;

  /* Prevent opening sandbox while interacting */
  const onClick = event => {
    if (edit || dragging || isMenuClicked(event)) event.preventDefault();
  };

  const sandboxProps = {
    sandboxTitle,
    sandbox,
    isTemplate,
    url,
    onClick,
    // edit mode
    edit,
    newTitle,
    inputRef,
    onChange,
    onKeyDown,
    onSubmit,
    onBlur,
    enterEditing,
  };

  const dragProps = {
    drag: true,
    // boundaries beyond which dragging is constrained
    // setting it to 0 brings card back to its position
    dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
    // To allow drag dispite constraints, we can allow
    // movement outside constraints (it still springs back)
    dragElastic: 1,
    // event handlers
    onDragStart,
    onDragEnd,
  };

  return (
    <motion.div {...dragProps}>
      <Component {...sandboxProps} {...props} />
    </motion.div>
  );
};

export const SkeletonSandbox = props => {
  const {
    state: { dashboard },
  } = useOvermind();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  if (viewMode === 'list') {
    return <SkeletonListItem {...props} />;
  }
  return <SkeletonCard {...props} />;
};
