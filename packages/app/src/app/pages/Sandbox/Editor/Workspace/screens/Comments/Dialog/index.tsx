import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Element,
  IconButton,
  Menu,
  Stack,
  Text,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { copyToClipboard } from 'app/utils/copy-to-clipboard';
import { OPTIMISTIC_COMMENT_ID } from 'app/overmind/namespaces/comments/state';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { AvatarBlock } from '../components/AvatarBlock';
import { EditComment } from '../components/EditComment';
import { Markdown } from './Markdown';
import { Reply } from './Reply';
import { useScrollTop } from './use-scroll-top';

export const CommentDialog = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

type DialogProps = {
  /** Final x position for dialog */
  x?: number;
  /** Final y position for dialog */
  y?: number;
  /** ref of element to animate from - deprecate this */
  triggerRef?: React.RefObject<any>;
};

export const Dialog: React.FC<DialogProps> = ({ triggerRef, ...props }) => {
  const { state, actions, effects } = useOvermind();
  const [value, setValue] = useState('');
  const comment = state.comments.currentComment;
  const currentCommentPositions = state.comments.currentCommentPositions;
  const isOptimistic = comment.id === OPTIMISTIC_COMMENT_ID;
  const [editing, setEditing] = useState(isOptimistic);
  const { ref: listRef, scrollTop } = useScrollTop();

  const closeDialog = () => actions.comments.closeComment();
  const onSubmitReply = () => {
    setValue('');
    actions.comments.addComment({
      content: value,
      parentCommentId: comment.id,
    });
  };

  if (!currentCommentPositions) {
    return null;
  }

  const OVERLAP_WITH_SIDEBAR = 20;
  const OFFSET_FROM_SIDEBAR_COMMENT = 90;

  let dialogPosition = {};

  if (currentCommentPositions.dialog) {
    dialogPosition = {
      x: currentCommentPositions.dialog.left + 400,
      y: currentCommentPositions.dialog.top,
    };
  } else if (currentCommentPositions.trigger) {
    dialogPosition = {
      x: currentCommentPositions.trigger.right - OVERLAP_WITH_SIDEBAR,
      y: currentCommentPositions.trigger.top - OFFSET_FROM_SIDEBAR_COMMENT,
    };
  } else {
    dialogPosition = { x: 400, y: 40 };
  }

  const animateFrom = {
    x: currentCommentPositions.trigger.left,
    y: currentCommentPositions.trigger.top,
  };

  return (
    <motion.div
      initial={{ ...animateFrom, scale: 0.5 }}
      animate={{ ...dialogPosition, scale: 1 }}
      drag
      dragMomentum={false}
      transition={{ duration: 0.25 }}
      style={{ position: 'absolute', zIndex: 2 }}
    >
      <Stack
        direction="vertical"
        css={css({
          position: 'absolute',
          zIndex: 2,
          backgroundColor: 'dialog.background',
          color: 'dialog.foreground',
          border: '1px solid',
          borderColor: 'dialog.border',
          borderRadius: 4,
          width: 420,
          height: 'auto',
          maxHeight: '80vh',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
          boxShadow: 2,
        })}
      >
        <Stack
          className="handle"
          align="center"
          justify="space-between"
          padding={4}
          paddingRight={2}
          marginBottom={2}
          css={css({
            cursor: 'move',
            zIndex: 2,
            boxShadow: theme =>
              scrollTop > 0
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
              disabled={isOptimistic}
              name="check"
              size={14}
              title="Resolve Comment"
              css={css({
                transition: 'color',
                transitionDuration: theme => theme.speeds[1],
                color: comment.isResolved ? 'green' : 'mutedForeground',
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

        {comment && (
          <Stack direction="vertical" css={{ overflow: 'auto' }} ref={listRef}>
            <Stack direction="vertical" gap={4}>
              <Stack
                align="flex-start"
                justify="space-between"
                marginLeft={4}
                marginRight={2}
              >
                <AvatarBlock comment={comment} />
                {state.user.id === comment.user.id && !isOptimistic && (
                  <Stack align="center">
                    <Menu>
                      <Menu.IconButton
                        name="more"
                        title="Comment actions"
                        size={12}
                      />
                      <Menu.List>
                        <Menu.Item
                          onSelect={() =>
                            actions.comments.deleteComment({
                              commentId: comment.id,
                            })
                          }
                        >
                          Delete
                        </Menu.Item>
                        <Menu.Item onSelect={() => setEditing(true)}>
                          Edit Comment
                        </Menu.Item>
                        <Menu.Item
                          onSelect={() => {
                            copyToClipboard(
                              `${window.location.origin}${window.location.pathname}?comment=${comment.id}`
                            );
                            effects.notificationToast.success(
                              'Comment permalink copied to clipboard'
                            );
                          }}
                        >
                          Share Comment
                        </Menu.Item>
                      </Menu.List>
                    </Menu>
                  </Stack>
                )}
              </Stack>
              <Element
                as={editing ? 'div' : 'p'}
                marginY={0}
                marginX={4}
                paddingBottom={6}
                css={css({
                  borderBottom: '1px solid',
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
            <>
              {comment.comments.map(reply =>
                reply ? <Reply reply={reply} key={reply.id} /> : 'Loading...'
              )}
            </>
          </Stack>
        )}

        {isOptimistic ? null : (
          <Textarea
            autosize
            css={css({
              overflow: 'hidden',
              border: 'none',
              display: 'block',
              borderTop: '1px solid',
              borderColor: 'sideBar.border',
            })}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={comment ? 'Reply' : 'Write a comment...'}
            onKeyDown={event => {
              if (event.keyCode === ENTER && !event.shiftKey) onSubmitReply();
            }}
          />
        )}
      </Stack>
    </motion.div>
  );
};

/**
 * Dialog
 * Add new comment
 * Comment
 * Edit comment
 * Add reply
 * Replies
 * Edit reply
 *
 */
