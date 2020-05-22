import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { isMenuClicked } from '@codesandbox/components';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SandboxListItem, SkeletonListItem } from './SandboxListItem';
import { useSelection } from '../Selection';

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
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  const onInputBlur = () => {
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
  type ItemTypes = { id: string; type: string };

  const [, dragRef, preview] = useDrag({
    item: { id: sandbox.id, type: 'sandbox' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (!dropResult || !dropResult.path) return;

      const currentCollectionPath = location.pathname.replace(
        '/new-dashboard',
        ''
      );

      if (dropResult.path === 'deleted') {
        actions.dashboard.deleteSandbox(selectedIds);
      } else if (dropResult.path === 'templates') {
        actions.dashboard.makeTemplate(selectedIds);
      } else if (dropResult.path === 'drafts') {
        actions.dashboard.addSandboxesToFolder({
          sandboxIds: selectedIds,
          collectionPath: '/',
          moveFromCollectionPath: currentCollectionPath,
        });
      } else {
        actions.dashboard.addSandboxesToFolder({
          sandboxIds: selectedIds,
          collectionPath: dropResult.path,
          moveFromCollectionPath: currentCollectionPath,
        });
      }
    },
  });

  /* View logic */
  let viewMode: string;
  const location = useLocation();

  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? SandboxListItem : SandboxCard;

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onBlur,
    onKeyDown,
    onDragStart,
    thumbnailRef,
    isDragging: isAnySandboxDragging,
  } = useSelection();

  const selected = selectedIds.includes(sandbox.id);
  const isDragging = isAnySandboxDragging && selected;

  const onClick = event => {
    if (edit || isDragging || isMenuClicked(event)) return;
    onSelectionClick(event, sandbox.id);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    if (edit || isDragging || isMenuClicked(event)) return;

    if (event.ctrlKey || event.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };
  const interactionProps = {
    tabIndex: 0, // make div focusable
    style: { outline: 'none' }, // we handle outline with border
    selected,
    onClick,
    onDoubleClick,
    onBlur,
    onKeyDown,
    'data-sandbox': sandbox.id,
  };

  const sandboxProps = {
    sandboxTitle,
    sandbox,
    isTemplate,
    // edit mode
    edit,
    newTitle,
    inputRef,
    onChange,
    onInputKeyDown,
    onSubmit,
    onInputBlur,
    enterEditing,
    // drag preview
    thumbnailRef,
    opacity: isDragging ? 0.25 : 1,
  };

  const dragProps = {
    ref: dragRef,
  };

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <>
      <div {...dragProps} onDragStart={event => onDragStart(event, sandbox.id)}>
        <motion.div
          layoutTransition={{
            type: 'spring',
            damping: 300,
            stiffness: 300,
          }}
        >
          <Component {...sandboxProps} {...interactionProps} {...props} />
        </motion.div>
      </div>
    </>
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
