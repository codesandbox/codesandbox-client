import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Icon } from '@codesandbox/components';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SandboxListItem, SkeletonListItem } from './SandboxListItem';
import { getTemplateIcon } from './TemplateIcon';
import { useSelection } from '../Selection';

const PrivacyIcons = {
  0: () => null,
  1: () => <Icon name="link" size={12} />,
  2: () => <Icon name="lock" size={12} />,
};

const GenericSandbox = ({ sandbox, ...props }) => {
  const {
    state: { dashboard },
    actions,
  } = useOvermind();

  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const TemplateIcon = getTemplateIcon(sandbox);
  const PrivacyIcon = PrivacyIcons[sandbox.privacy];

  /* Drag logic */

  const location = useLocation();
  const currentCollectionPath = location.pathname
    .replace('/new-dashboard', '')
    .replace('/all', '');

  const [, dragRef, preview] = useDrag({
    item: {
      type: 'sandbox',
      id: sandbox.id,
      collectionPath: currentCollectionPath,
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (!dropResult || !dropResult.path) return;

      onDrop(dropResult);
    },
  });

  /* View logic */
  let viewMode: string;

  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('home')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? SandboxListItem : SandboxCard;

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onMouseDown,
    onRightClick,
    onMenuEvent,
    onBlur,
    onKeyDown,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging: isAnythingDragging,
    isRenaming,
    setRenaming,
  } = useSelection();

  const selected = selectedIds.includes(sandbox.id);
  const isDragging = isAnythingDragging && selected;

  const onClick = event => {
    onSelectionClick(event, sandbox.id);
  };

  const onContextMenu = event => {
    event.preventDefault();
    if (event.type === 'contextmenu') onRightClick(event, sandbox.id);
    else onMenuEvent(event, sandbox.id);
  };

  const history = useHistory();
  const onDoubleClick = event => {
    // can't open deleted items, they don't exist anymore
    if (location.pathname.includes('deleted')) {
      onContextMenu(event);
      return;
    }

    // Templates in Home should fork, everything else opens
    if (event.ctrlKey || event.metaKey) {
      if (sandbox.isHomeTemplate) {
        actions.editor.forkExternalSandbox({
          sandboxId: sandbox.id,
          openInNewWindow: true,
        });
      } else {
        window.open(url, '_blank');
      }
    } else if (sandbox.isHomeTemplate) {
      actions.editor.forkExternalSandbox({
        sandboxId: sandbox.id,
      });
    } else {
      history.push(url);
    }
  };

  /* Edit logic */

  const [newTitle, setNewTitle] = React.useState(sandboxTitle);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === ESC) {
      // Reset value and exit without saving
      setNewTitle(sandboxTitle);
      setRenaming(false);
    }
  };

  const onSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    await actions.dashboard.renameSandbox({
      id: sandbox.id,
      title: newTitle,
      oldTitle: sandboxTitle,
    });
    setRenaming(false);
  };

  const onInputBlur = () => {
    // save value when you click outside or tab away
    onSubmit();
  };

  const interactionProps = {
    tabIndex: 0, // make div focusable
    style: {
      outline: 'none',
    }, // we handle outline with border
    selected,
    onClick,
    onMouseDown,
    onDoubleClick,
    onContextMenu,
    onBlur,
    onKeyDown,
    'data-selection-id': sandbox.id,
  };

  const sandboxProps = {
    sandboxTitle,
    sandbox,
    isTemplate: sandbox.isTemplate,
    TemplateIcon,
    PrivacyIcon,
    // edit mode
    editing: isRenaming && selected,
    newTitle,
    onChange,
    onInputKeyDown,
    onSubmit,
    onInputBlur,
    // drag preview
    thumbnailRef,
    opacity: isDragging ? 0.25 : 1,
  };

  const dragProps = sandbox.isHomeTemplate
    ? {}
    : {
        ref: dragRef,
        onDragStart: event => onDragStart(event, sandbox.id),
      };

  React.useEffect(() => {
    preview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }, [preview]);

  const resizing = useResizing();
  const motionProps = resizing
    ? {}
    : {
        layoutTransition: {
          type: 'spring',
          damping: 300,
          stiffness: 300,
        },
      };

  return (
    <>
      <div {...dragProps}>
        <motion.div {...motionProps}>
          <Component {...sandboxProps} {...interactionProps} {...props} />
        </motion.div>
      </div>
    </>
  );
};

export const Sandbox = React.memo(GenericSandbox);

export const SkeletonSandbox = props => {
  const {
    state: { dashboard },
  } = useOvermind();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('home')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  if (viewMode === 'list') {
    return <SkeletonListItem {...props} />;
  }
  return <SkeletonCard {...props} />;
};

const useResizing = () => {
  const TIMEOUT = 250;
  const [resizing, setResizing] = React.useState(false);

  React.useEffect(() => {
    let timeoutId = null;

    const handler = () => {
      setResizing(true);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setResizing(false), TIMEOUT);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return resizing;
};
