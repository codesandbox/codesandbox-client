import { UserQuery } from '@codesandbox/common/lib/types';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import {
  Avatar,
  Element,
  IconButton,
  Menu,
  Stack,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Markdown } from 'app/components/Markdown';
import {
  DIALOG_TRANSITION_DURATION,
  DIALOG_WIDTH,
  REPLY_TRANSITION_DELAY,
} from 'app/constants';
import { CommentWithRepliesFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { OPTIMISTIC_COMMENT_ID } from 'app/overmind/namespaces/comments/state';
import { Image } from 'app/components/Markdown/Image'
import {
  convertImageReferencesToMarkdownImages,
  convertUserReferencesToMentions,
} from 'app/overmind/utils/comments';
import { motion, useAnimation } from 'framer-motion';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';

import { AvatarBlock } from '../components/AvatarBlock';
import { EditComment } from '../components/EditComment';
import { useCodesandboxCommentEditor } from '../hooks/useCodesandboxCommentEditor';
import { Reply, SkeletonReply } from './Reply';
import { useScrollTop } from './use-scroll-top';

interface CommentDialogProps {
  comment: CommentWithRepliesFragment;
}


export const CommentDialog: React.FC<CommentDialogProps> = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

export const Dialog: React.FC<CommentDialogProps> = props => {
  const { state, actions } = useOvermind();
  const controller = useAnimation();

  const { comment } = props;
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

  const [dragging, setDragging] = React.useState(false);

  const onDragHandlerPan = (deltaX: number, deltaY: number) => {
    controller.set((_, target) => ({
      x: Math.round(Number(target.x) + deltaX),
      y: Math.round(Number(target.y) + deltaY),
    }));
    setDragging(true);
  };

  const onDragHandlerPanEnd = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    const listener = event => {
      if (event.which === ESC) {
        actions.comments.closeComment();
      }
    };

    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [actions.comments]);

  if (!currentCommentPositions) {
    return null;
  }
  return (
    <>
      {dragging && <Overlay />}
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
            paddingBottom: 4,
            height: 'auto',
            maxHeight: '80vh',
            fontFamily: 'Inter, sans-serif',
            boxShadow: 2,
          })}
        >
          {isNewComment && editing ? (
            <DialogAddComment
              comment={comment}
              onSave={(content, mentions) => {
                actions.comments.saveOptimisticComment({
                  content,
                  mentions,
                });
                setEditing(false);
              }}
              onDragHandlerPan={onDragHandlerPan}
              onDragHandlerPanEnd={onDragHandlerPanEnd}
            />
          ) : (
            <>
              <DragHandle
                onPan={onDragHandlerPan}
                onPanEnd={onDragHandlerPanEnd}
              >
                <DialogHeader comment={comment} hasShadow={scrollTop > 0} />
              </DragHandle>
              <Element
                as="div"
                css={
                  editing
                    ? null
                    : {
                        overflow: 'auto',
                      }
                }
                ref={listRef}
              >
                <CommentBody
                  comment={comment}
                  editing={editing}
                  setEditing={setEditing}
                  hasReplies={replies.length}
                />

                <Replies
                  key={comment.id}
                  replies={replies}
                  replyCount={comment.replyCount}
                  repliesRenderedCallback={() => setRepliesRendered(true)}
                  listRef={listRef}
                />
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
    </>
  );
};

const PreviewScreenshot: React.FC<{url: string}> = ({ url }) => (
    <Element css={css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 4,
      'img': {
        maxWidth: '100%'
      }
    })}><Image src={url} alt="Preview Screenshot" ignorePrivateSandboxRestriction /></Element>
  )

const DialogAddComment: React.FC<{
  comment: CommentWithRepliesFragment;
  onSave: (value: string, mentions: { [username: string]: UserQuery }) => void;
  onDragHandlerPan: (deltaX: number, deltaY: number) => void;
  onDragHandlerPanEnd: () => void;
}> = ({ comment, onSave, onDragHandlerPan, onDragHandlerPanEnd }) => {
  const { actions } = useOvermind();
  const [elements] = useCodesandboxCommentEditor({
    initialValue: '',
    initialMentions: {},
    initialImages: {},
    onSubmit: onSave,
    fixed: false,
    props: {
      autosize: true,
      autoFocus: true,
      css: css({
        backgroundColor: 'transparent',
        border: 'none',
        paddingLeft: 4,
      }),
      style: { lineHeight: 1.2, minHeight: 32 },
    },
  });

  const closeDialog = () => actions.comments.closeComment();

  return (
    <Stack direction="vertical">
      <DragHandle onPan={onDragHandlerPan} onPanEnd={onDragHandlerPanEnd}>
        <Stack
          justify="space-between"
          marginY={4}
          marginLeft={4}
          marginRight={2}
        >
          <Stack gap={2} align="center">
            <Element
              itemProp="author"
              itemScope
              itemType="http://schema.org/Person"
            >
              <Avatar user={comment.user} />
            </Element>
            <Text size={3} weight="bold" variant="body" itemProp="name">
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
      {comment.anchorReference && comment.anchorReference.type === 'preview' ? <PreviewScreenshot url={(comment.anchorReference.metadata as any).screenshotUrl} /> : null}
      {elements}
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
  onPanEnd: () => void;
}> = ({ onPan, onPanEnd, children }) => (
  <motion.div
    onPan={(_, info) => {
      onPan(info.delta.x, info.delta.y);
    }}
    onPanEnd={onPanEnd}
    style={{ cursor: 'move', zIndex: 2 }}
  >
    <GlobalStyles />
    {children}
  </motion.div>
);

const DialogHeader = ({ comment, hasShadow }) => {
  const {
    state: { editor, user },
    actions: { comments },
  } = useOvermind();

  const closeDialog = () => comments.closeComment();

  const canResolve =
    hasPermission(editor.currentSandbox.authorization, 'write_project') ||
    comment.user.id === user.id;

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
        transition: 'box-shadow ease-in-out',
        transitionDuration: theme => theme.speeds[1],
      })}
    >
      <Text size={3} weight="bold">
        Comment
      </Text>
      <Stack align="center">
        {canResolve && (
          <IconButton
            onClick={() =>
              comments.resolveComment({
                commentId: comment.id,
                isResolved: !comment.isResolved,
              })
            }
            name="check"
            size={14}
            title={comment.isResolved ? 'Unresolve Comment' : 'Resolve Comment'}
            css={css({
              transition: 'color',
              transitionDuration: theme => theme.speeds[1],
              color: comment.isResolved ? 'green' : 'mutedForeground',
              ':hover:not(:disabled), :focus:not(:disabled)': {
                color: comment.isResolved ? 'green' : 'foreground',
              },
            })}
          />
        )}
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
  const {
    state,
    actions: { comments },
  } = useOvermind();
  const isCommenter = state.user.id === comment.user.id;

  return (
    <Stack direction="vertical" gap={4}>
      <Stack
        align="flex-start"
        justify="space-between"
        marginLeft={4}
        marginRight={2}
      >
        <AvatarBlock comment={comment} />
        <Stack align="center">
          <Menu>
            <Menu.IconButton name="more" title="Comment actions" size={12} />
            <Menu.List>
              {isCommenter && (
                <Menu.Item onSelect={() => setEditing(true)}>
                  Edit Comment
                </Menu.Item>
              )}
              <Menu.Item
                onSelect={() => comments.copyPermalinkToClipboard(comment.id)}
              >
                Share Comment
              </Menu.Item>
              {isCommenter && (
                <Menu.Item
                  onSelect={() => {
                    comments.closeComment();
                    comments.deleteComment({
                      commentId: comment.id,
                    });
                  }}
                >
                  Delete
                </Menu.Item>
              )}
            </Menu.List>
          </Menu>
        </Stack>
      </Stack>
      {comment.anchorReference && comment.anchorReference.type === 'preview' ? <PreviewScreenshot url={comment.anchorReference.metadata.screenshotUrl} /> : null}
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
          <Element itemProp="text">
            <Markdown
              source={convertImageReferencesToMarkdownImages(
                comment.content,
                comment.references
              )}
            />
          </Element>
        ) : (
          <EditComment
            initialValue={comment.content}
            initialMentions={convertUserReferencesToMentions(
              comment.references
            )}
            onSave={async (newValue, mentions, images) => {
              await comments.updateComment({
                commentId: comment.id,
                content: newValue,
                mentions,
                images,
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

const Replies = ({ replies, replyCount, listRef, repliesRenderedCallback }) => {
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

  // initial status of replies -
  // this is false when it's the first time this specific comment is opened
  // after that it will be true because we cache replies in state
  const repliesLoaded = replies.length === replyCount;
  const repliesAlreadyLoadedOnFirstRender = React.useRef(repliesLoaded);

  /** CONSTANTS:
   * Wait another <delay> after the dialog has transitioned into view
   * These are in s not ms
   */
  const delay = DIALOG_TRANSITION_DURATION + REPLY_TRANSITION_DELAY;
  const SKELETON_FADE_DURATION = 0.25;
  const SKELETON_HEIGHT = 146;
  const REPLY_TRANSITION_DURATION = repliesLoaded
    ? 0
    : Math.max(replyCount * 0.15, 0.5);

  // current status of replies-
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
  const skeletonController = useAnimation();
  const repliesController = useAnimation();

  /*
   * T = 0 (DOM has rendered, animations can be started)
   * If there are no replies, skip all of the animations
   * If replies aren't loaded, show skeleton
   * If replies are loaded, do nothing and wait for next animation
   * */
  React.useEffect(() => {
    if (!replyCount) {
      // If the dialog is already open without any replies,
      // just skip all of the animations for opening transitions
      repliesController.set({ opacity: 1, height: 'auto' });
      setStepInTimeline(2);
    } else if (!repliesAlreadyLoadedOnFirstRender.current && T === -1) {
      skeletonController.set({ height: SKELETON_HEIGHT, opacity: 1 });
      setStepInTimeline(0);
    }
  }, [
    skeletonController,
    repliesController,
    replies.length,
    T,
    replyCount,
    repliesRenderedCallback,
  ]);

  /**
   * T = 1 (Dialog's enter animation has completed, hence the delay)
   * If replies have loaded, remove skeleton, transition the replies
   * If replies have not loaded, do nothing and wait for next animation
   */
  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (T >= 1) return; // can't go back in time

      if (repliesLoaded) {
        skeletonController.set({ position: 'absolute' });
        skeletonController.start({
          height: 0,
          opacity: 0,
          transition: { duration: SKELETON_FADE_DURATION },
        });
        repliesController.set({ opacity: 1 });
        repliesController
          .start({
            height: 'auto',
            transition: { duration: REPLY_TRANSITION_DURATION },
          })
          .then(() => {
            repliesRenderedCallback();
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
    T,
    repliesRenderedCallback,
  ]);

  /**
   * T = R1 or R2 (Replies have now loaded)
   * this is a parralel async process and can happen before or after t=1
   * If it's before T=1, do nothing, wait for T=1
   * If it's after T=1, start replies transition now!
   */
  React.useEffect(() => {
    if (!repliesLoaded) {
      // do nothing, wait for T=1
    } else if (T === 1) {
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

  React.useEffect(() => {
    // when the animations are done, scroll to last reply
    let timeout;

    if (T === 2) {
      timeout = window.setTimeout(() => {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, REPLY_TRANSITION_DURATION * 1000);
    }

    return () => window.clearTimeout(timeout);
  }, [T, listRef, REPLY_TRANSITION_DURATION]);

  return (
    <>
      <motion.div
        initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
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
        {replies.map(reply => reply && <Reply reply={reply} key={reply.id} />)}
      </motion.ul>
    </>
  );
};

const AddReply: React.FC<any> = ({ comment, ...props }) => {
  const { actions } = useOvermind();
  const [elements] = useCodesandboxCommentEditor({
    initialValue: '',
    initialMentions: {},
    initialImages: {},
    onSubmit: (value, mentions, images) => {
      actions.comments.saveNewComment({
        content: value,
        mentions,
        images,
        parentCommentId: comment.id,
      });
      if (props.onSubmit) props.onSubmit();
    },
    fixed: false,
    props: {
      autosize: true,
      css: css({
        backgroundColor: 'transparent',
        border: 'none',
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        borderRadius: 0,
        padding: 4,
      }),
      style: { lineHeight: 1.2, minHeight: 54 },
    },
  });

  return elements;
};

/** We use an transparent overlay when dragging
 *  so that we can stop selection of the text
 *  in the background when your drag the dialog.
 */
const Overlay = () => (
  <Element
    as="div"
    css={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    }}
  />
);

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

  let dialogPosition = { x: null, y: null };

  if (currentCommentPositions?.dialog) {
    // if we know the expected dialog position
    // true for comments with code reference
    dialogPosition = {
      x: currentCommentPositions.dialog.left,
      y: currentCommentPositions.dialog.top + OFFSET_TOP_FOR_ALIGNMENT,
    };
  } else if (currentCommentPositions?.trigger) {
    // if don't know, we calculate based on the trigger
    // true for comments opened from the sidebar (both global and code)

    if (isCodeComment) {
      dialogPosition = {
        x: currentCommentPositions.trigger.right,
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
