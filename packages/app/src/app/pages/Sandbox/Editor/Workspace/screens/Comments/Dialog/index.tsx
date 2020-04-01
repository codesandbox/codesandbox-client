import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Avatar,
  Element,
  IconButton,
  Menu,
  Stack,
  Text,
  Textarea,
} from '@codesandbox/components';
import { createGlobalStyle } from 'styled-components';
import css from '@styled-system/css';
import { CommentFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { OPTIMISTIC_COMMENT_ID } from 'app/overmind/namespaces/comments/state';
import { motion, useAnimation } from 'framer-motion';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { AvatarBlock } from '../components/AvatarBlock';
import { EditComment } from '../components/EditComment';
import { Markdown } from './Markdown';
import { Reply, SkeletonReply } from './Reply';
import { useScrollTop } from './use-scroll-top';

export const CommentDialog = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

const DIALOG_WIDTH = 420;
const DIALOG_TRANSITION_DURATION = 0.25;
const REPLY_TRANSITION_DELAY = 0.5;

export const Dialog: React.FC = () => {
  const { state } = useOvermind();
  const controller = useAnimation();

  const comment = state.comments.currentComment;
  const replies = comment.comments;

  // This comment doens't exist in the database, it's an optimistic comment
  const isNewComment = comment.id === OPTIMISTIC_COMMENT_ID;

  const [editing, setEditing] = useState(isNewComment);
  const { ref: listRef, scrollTop } = useScrollTop();
  const dialogRef = React.useRef();

  const currentCommentPositions = state.comments.currentCommentPositions;
  const isCodeComment =
    comment.references[0] && comment.references[0].type === 'code';

  // this could rather be `getInitialPosition`
  const initialPosition = getInitialPosition(currentCommentPositions);

  const [repliesRendered, setRepliesRendered] = React.useState(false);

  // reset editing when comment changes
  React.useEffect(() => {
    setEditing(isNewComment);
    // this could rather be `getAnimatedPosition`
    const endPosition = getEndPosition(
      currentCommentPositions,
      isCodeComment,
      dialogRef
    );
    controller.start({
      ...endPosition,
      scale: 1,
      opacity: 1,
    });
  }, [
    comment.id,
    controller,
    currentCommentPositions,
    isCodeComment,
    isNewComment,
    repliesRendered,
  ]);

  React.useEffect(() => {
    setRepliesRendered(false);
  }, [comment.id]);

  const onDragHandlerPan = (deltaX: number, deltaY: number) => {
    controller.set((_, target) => ({
      x: Number(target.x) + deltaX,
      y: Number(target.y) + deltaY,
    }));
  };

  if (!currentCommentPositions) {
    return null;
  }
  return (
    <motion.div
      key={isCodeComment ? 'code' : 'global'}
      initial={{ ...initialPosition, scale: 0.5, opacity: 0 }}
      animate={controller}
      transition={{ duration: DIALOG_TRANSITION_DURATION }}
      style={{ position: 'absolute', zIndex: 2 }}
    >
      <Stack
        ref={dialogRef}
        direction="vertical"
        css={css({
          position: 'absolute',
          zIndex: 2,
          backgroundColor: 'dialog.background',
          color: 'dialog.foreground',
          border: '1px solid',
          borderColor: 'dialog.border',
          borderRadius: 4,
          width: DIALOG_WIDTH,
          height: 'auto',
          maxHeight: '80vh',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          boxShadow: 2,
        })}
      >
        {isNewComment && editing ? (
          <DialogAddComment
            comment={comment}
            onSave={() => setEditing(false)}
            onDragHandlerPan={onDragHandlerPan}
          />
        ) : (
          <>
            <DragHandle onPan={onDragHandlerPan}>
              <DialogHeader comment={comment} hasShadow={scrollTop > 0} />
            </DragHandle>
            <Element as="div" css={{ overflow: 'auto' }} ref={listRef}>
              <CommentBody
                comment={comment}
                editing={editing}
                setEditing={setEditing}
                hasReplies={replies.length}
              />
              {replies.length ? (
                <Replies
                  replies={replies}
                  repliesRenderedCallback={() => setRepliesRendered(true)}
                />
              ) : null}
            </Element>
            <AddReply
              comment={comment}
              onSubmit={() => {
                // scroll to bottom of the list,
                // have to wait for it to load though :)
                window.requestAnimationFrame(() => {
                  listRef.current.scrollTop = listRef.current.scrollHeight;
                });
              }}
            />
          </>
        )}
      </Stack>
    </motion.div>
  );
};

const DialogAddComment: React.FC<{
  comment: CommentFragment;
  onSave: () => void;
  onDragHandlerPan: (deltaX: number, deltaY: number) => void;
}> = ({ comment, onSave, onDragHandlerPan }) => {
  const { actions } = useOvermind();
  const [value, setValue] = useState('');

  const saveComment = async () => {
    await actions.comments.updateComment({
      commentId: comment.id,
      content: value,
    });
    setValue('');
    onSave();
  };

  const closeDialog = () => actions.comments.closeComment();

  return (
    <Stack direction="vertical" css={css({ paddingBottom: 4 })}>
      <DragHandle onPan={onDragHandlerPan}>
        <Stack
          justify="space-between"
          align="center"
          marginY={4}
          marginLeft={4}
          marginRight={2}
        >
          <Stack gap={2} align="center">
            <Avatar user={comment.user} />
            <Text size={3} weight="bold" variant="body">
              {comment.user.username}
            </Text>
          </Stack>
          <IconButton
            name="cross"
            size={10}
            title="Close comment dialog"
            onClick={closeDialog}
          />
        </Stack>
      </DragHandle>
      <Textarea
        autosize
        autoFocus
        css={css({
          backgroundColor: 'transparent',
          border: 'none',
          paddingLeft: 4,
        })}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add comment..."
        onKeyDown={async event => {
          if (event.keyCode === ENTER && !event.shiftKey) {
            saveComment();
            event.preventDefault();
          }
        }}
      />
    </Stack>
  );
};

/** When the dialog is dragged outside the window
 *  It creates a scrollbar. We want to disable overflow
 *  when the drag handle is DOM
 */

const GlobalStyles = createGlobalStyle`
  body { overflow: hidden; }
`;

const DragHandle: React.FC<{
  onPan: (deltaX: number, deltaY: number) => void;
}> = ({ onPan, children }) => (
  <motion.div
    onPan={(_, info) => {
      onPan(info.delta.x, info.delta.y);
    }}
    style={{ cursor: 'move', zIndex: 2 }}
  >
    <GlobalStyles />
    {children}
  </motion.div>
);

const DialogHeader = ({ comment, hasShadow }) => {
  const { actions } = useOvermind();

  const closeDialog = () => actions.comments.closeComment();

  return (
    <Stack
      align="center"
      justify="space-between"
      padding={4}
      paddingRight={2}
      marginBottom={2}
      css={css({
        boxShadow: theme =>
          hasShadow
            ? `0px 32px 32px ${theme.colors.dialog.background}`
            : 'none',
      })}
    >
      <Text size={3} weight="bold">
        Comment
      </Text>
      <Stack align="center">
        <IconButton
          onClick={() =>
            actions.comments.resolveComment({
              commentId: comment.id,
              isResolved: !comment.isResolved,
            })
          }
          name="check"
          size={14}
          title="Resolve Comment"
          css={css({
            transition: 'color',
            transitionDuration: theme => theme.speeds[1],
            color: comment.isResolved ? 'green' : 'mutedForeground',
            ':hover:not(:disabled), :focus:not(:disabled)': {
              color: comment.isResolved ? 'green' : 'foreground',
            },
          })}
        />
        <IconButton
          name="cross"
          size={10}
          title="Close comment dialog"
          onClick={closeDialog}
        />
      </Stack>
    </Stack>
  );
};

const CommentBody = ({ comment, editing, setEditing, hasReplies }) => {
  const { state, actions } = useOvermind();

  return (
    <Stack direction="vertical" gap={4}>
      <Stack
        align="flex-start"
        justify="space-between"
        marginLeft={4}
        marginRight={2}
      >
        <AvatarBlock comment={comment} />
        {state.user.id === comment.user.id && (
          <Stack align="center">
            <Menu>
              <Menu.IconButton name="more" title="Comment actions" size={12} />
              <Menu.List>
                <Menu.Item onSelect={() => setEditing(true)}>
                  Edit Comment
                </Menu.Item>
                <Menu.Item
                  onSelect={() => {
                    actions.comments.closeComment();
                    actions.comments.deleteComment({
                      commentId: comment.id,
                    });
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.List>
            </Menu>
          </Stack>
        )}
      </Stack>
      <Element
        marginY={0}
        marginX={4}
        paddingBottom={6}
        css={css({
          borderBottom: hasReplies ? '1px solid' : 'none',
          borderColor: 'sideBar.border',
        })}
      >
        {!editing ? (
          <Markdown source={comment.content} />
        ) : (
          <EditComment
            initialValue={comment.content}
            onSave={async newValue => {
              await actions.comments.updateComment({
                commentId: comment.id,
                content: newValue,
              });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}
      </Element>
    </Stack>
  );
};

const Replies = ({ replies, repliesRenderedCallback }) => {
  /**
   * Loading animations:
   * 0. Wait for the dialog to have animated in view and scaled up.
   * 1. If replies have not loaded yet - show skeleton with 146px height,
   * when the comments load, replace skeleton with replies and
   * transition to height auto
   * 2. If replies are already there - show replies with 0px height,
   * transition to height: auto
   *
   */

  const skeletonController = useAnimation();
  const repliesController = useAnimation();

  /** Wait another <delay>ms after the dialog has transitioned into view */
  const delay = DIALOG_TRANSITION_DURATION + REPLY_TRANSITION_DELAY;
  const REPLY_TRANSITION_DURATION = Math.max(replies.length * 0.15, 0.5);
  const SKELETON_FADE_DURATION = 0.25;
  const SKELETON_HEIGHT = 146;

  // initial status of replies -
  // this is false when it's the first time this specific comment is opened
  // after that it will be true because we cache replies in state
  const repliesAlreadyLoadedOnFirstRender = React.useRef(!!replies[0]);

  // current status of replies-
  const repliesLoaded = !!replies[0];

  /** Welcome to the imperative world of timeline animations
   *
   * -------------------------------------------------------
   * |             |             |           |           |
   * t=0         t=R1           t=1        t=R2         t=2
   *
   * Legend:
   * t=0 DOM has rendered, animations can be started
   * t=1 Dialog's enter animation has completed, replies animations can start
   * t=2 Replies animation have started
   * t=R1 Replies have loaded before t=1
   * t=R2 Replies have loaded after t=1
   *
   */
  const [T, setStepInTimeline] = React.useState(-1);

  /*
   * T = 0 (DOM has rendered, animations can be started)
   * If replies aren't loaded, show skeleton
   * If replies are loaded, do nothing and wait for next animation
   * */
  React.useEffect(() => {
    if (!repliesAlreadyLoadedOnFirstRender.current) {
      skeletonController.set({ height: SKELETON_HEIGHT, opacity: 1 });
    } else {
      // do nothing, wait for the delayed animation to kick in
    }
    setStepInTimeline(0);
  }, [skeletonController]);

  /**
   * T = 1 (Dialog's enter animation has completed, hence the delay)
   * If replies have loaded, remove skeleton, transition the replies
   * If replies have not loaded, do nothing and wait for next animation
   */
  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (repliesLoaded) {
        skeletonController.set({
          position: 'absolute',
        });
        skeletonController.start({
          height: 0,
          opacity: 0,
          transition: { duration: SKELETON_FADE_DURATION },
        });
        repliesController.set({ opacity: 1 });
        repliesController.start({
          height: 'auto',
          transition: { duration: REPLY_TRANSITION_DURATION },
        });
        setStepInTimeline(2);
      } else {
        setStepInTimeline(1);
      }
    }, delay * 1000);
    return () => window.clearTimeout(timeout);
  }, [
    skeletonController,
    repliesController,
    repliesLoaded,
    delay,
    REPLY_TRANSITION_DURATION,
  ]);

  /**
   * T = R1 or R2 (Replies have now loaded)
   * this is a parralel async process and can happen before or after t=1
   * If it's before T=1, do nothing, wait for T=1
   * If it's after T=1, start replies transition now!
   */
  React.useEffect(() => {
    if (!repliesLoaded) return;
    if (T === 1) {
      skeletonController.start({
        height: 0,
        opacity: 0,
        transition: { duration: REPLY_TRANSITION_DURATION },
      });
      repliesController.set({ opacity: 1 });
      repliesController.start({
        height: 'auto',
        transition: { duration: REPLY_TRANSITION_DURATION },
      });
      setStepInTimeline(2);
    }
  }, [
    T,
    repliesLoaded,
    REPLY_TRANSITION_DURATION,
    skeletonController,
    repliesController,
  ]);

  return (
    <>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={skeletonController}
      >
        <SkeletonReply />
      </motion.div>

      <motion.ul
        initial={{ height: 0, opacity: 0 }}
        animate={repliesController}
        style={{
          overflow: 'visible',
          paddingLeft: 0,
          margin: 0,
          listStyle: 'none',
        }}
      >
        <>
          {replies.map(
            reply => reply && <Reply reply={reply} key={reply.id} />
          )}
        </>
      </motion.ul>
    </>
  );
};

const AddReply = ({ comment, ...props }) => {
  const { actions } = useOvermind();
  const [value, setValue] = useState('');

  const onSubmit = () => {
    setValue('');
    actions.comments.addComment({
      content: value,
      parentCommentId: comment.id,
    });
    if (props.onSubmit) props.onSubmit();
  };

  return (
    <Textarea
      autosize
      css={css({
        backgroundColor: 'transparent',
        border: 'none',
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        borderRadius: 0,
        padding: 4,
      })}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Reply..."
      onKeyDown={event => {
        if (event.keyCode === ENTER && !event.shiftKey) onSubmit();
      }}
    />
  );
};

// trying to match the position for code comments
const FALLBACK_POSITION = { x: 800, y: 120 };

const getInitialPosition = currentCommentPositions => {
  let animateFrom = { x: null, y: null };

  if (currentCommentPositions?.trigger) {
    animateFrom = {
      x: currentCommentPositions.trigger.left,
      y: currentCommentPositions.trigger.top,
    };
  } else {
    // if we don't know the trigger, slide in from left
    // probably comment from permalink
    animateFrom = {
      x: 0,
      y: FALLBACK_POSITION.y,
    };
  }

  return animateFrom;
};

const getEndPosition = (currentCommentPositions, isCodeComment, dialogRef) => {
  const OVERLAP_WITH_SIDEBAR = -20;
  const OFFSET_TOP_FOR_ALIGNMENT = -90;
  const OFFSET_FOR_CODE = 500;

  let dialogPosition = { x: null, y: null };

  if (currentCommentPositions?.dialog) {
    // if we know the expected dialog position
    // true for comments with code reference
    dialogPosition = {
      x: currentCommentPositions.dialog.left + OFFSET_FOR_CODE,
      y: currentCommentPositions.dialog.top + OFFSET_TOP_FOR_ALIGNMENT,
    };
  } else if (currentCommentPositions?.trigger) {
    // if don't know, we calculate based on the trigger
    // true for comments opened from the sidebar (both global and code)

    if (isCodeComment) {
      dialogPosition = {
        x: currentCommentPositions.trigger.right + OFFSET_FOR_CODE,
        y: currentCommentPositions.trigger.top + OFFSET_TOP_FOR_ALIGNMENT,
      };
    } else {
      dialogPosition = {
        x: currentCommentPositions.trigger.right + OVERLAP_WITH_SIDEBAR,
        y: currentCommentPositions.trigger.top + OFFSET_TOP_FOR_ALIGNMENT,
      };
    }
  } else {
    // if we know neither, we put it at  nice spot on the page
    // probably comment from permalink
    dialogPosition = { ...FALLBACK_POSITION };
  }

  // check for window colisions here and offset positions more
  let finalHeight;

  if (dialogRef.current) {
    /** Even when we have the rect, we don't always know
     * if it's in it's final height while it's animating
     *
     * We do know that it animates from 0.5 to 1, so those are the
     * 2 values we might get, based on that we can double the initial
     * height to get final height
     *
     */

    const dialogRect = dialogRef.current.getBoundingClientRect();

    const animatingElement = dialogRef.current.parentElement;
    const scale = animatingElement.style.transform;

    finalHeight = scale.includes('scale(0.5')
      ? dialogRect.height * 2
      : dialogRect.height;
  } else {
    /** Until the ref is set, we don't know enough,
     * so we're guessing on the safe side
     */
    finalHeight = 420;
  }

  /** The parent of this dialog is starts at 48px
   * This will change when we move the comment out!
   */
  const PARENT_Y_OFFSET = 48;

  const BUFFER_FROM_EDGE = 32;

  const maxLeft = window.innerWidth - DIALOG_WIDTH - BUFFER_FROM_EDGE;
  const maxTop =
    window.innerHeight - finalHeight - BUFFER_FROM_EDGE - PARENT_Y_OFFSET;

  if (dialogPosition.x > maxLeft) dialogPosition.x = maxLeft;
  if (dialogPosition.y > maxTop) dialogPosition.y = maxTop;

  return dialogPosition;
};
