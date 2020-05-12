import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useOvermind } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { isMenuClicked } from '@codesandbox/components';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SandboxListItem, SkeletonListItem } from './SandboxListItem';
import { DragPreview } from './DragPreview';

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

  const [{ isDragging }, drag, preview] = useDrag({
    item: { id: sandbox.id, type: 'sandbox' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        // onMove(name, dropResult.name);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const thumbnailRef = React.useRef();

  /* View logic */
  const location = useLocation();

  let viewMode: string;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const Component = viewMode === 'list' ? SandboxListItem : SandboxCard;

  /* Prevent opening sandbox while interacting */
  const onClick = event => {
    if (edit || isDragging || isMenuClicked(event)) event.preventDefault();
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
    // drag preview
    thumbnailRef,
    opacity: isDragging ? 0.25 : 1,
  };

  const dragProps = {
    ref: drag,
  };

  React.useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <>
      <div {...dragProps}>
        <Component {...sandboxProps} {...props} />
      </div>
      {isDragging ? (
        <DragPreview viewMode={viewMode} {...sandboxProps} />
      ) : null}
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
