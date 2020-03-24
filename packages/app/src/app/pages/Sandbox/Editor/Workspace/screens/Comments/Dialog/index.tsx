import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Button,
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

import { Markdown } from './Markdown';
import { Reply } from './Reply';
import { useScrollTop } from './use-scroll-top';
import { AvatarBlock } from '../components/AvatarBlock';

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
  const isOptimistic = comment.id === OPTIMISTIC_COMMENT_ID;
  const [edit, setEdit] = useState(isOptimistic);
  const [editValue, setEditValue] = useState(comment.content);

  const closeDialog = () => actions.comments.selectComment(null);
  const onSubmitReply = () => {
    setValue('');
    actions.comments.addComment({
      content: value,
      parentCommentId: comment.id,
    });
  };

  const [position, setPosition] = useState({
    x: props.x || 400,
    y: props.y || 40,
  });
  const OVERLAP_WITH_SIDEBAR = 20;
  const OFFSET_FROM_SIDEBAR_COMMENT = 90;

  const [animateFrom, setAnimateFrom] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (triggerRef.current) {
      const { left, right, top } = triggerRef.current.getBoundingClientRect();
      setAnimateFrom({ x: left, y: top });
      setPosition({
        x: right - OVERLAP_WITH_SIDEBAR,
        y: top - OFFSET_FROM_SIDEBAR_COMMENT,
      });
    }
  }, [triggerRef]);

  const { ref: listRef, scrollTop } = useScrollTop();

  return (
    <motion.div
      initial={{ ...animateFrom, scale: 0.5 }}
      animate={{ ...position, scale: 1 }}
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
                        <Menu.Item onSelect={() => setEdit(true)}>
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
                as={edit ? 'div' : 'p'}
                marginY={0}
                marginX={4}
                paddingBottom={6}
                css={css({
                  borderBottom: '1px solid',
                  borderColor: 'sideBar.border',
                })}
              >
                {!edit ? (
                  <Markdown source={comment.content} />
                ) : (
                  <>
                    <Element marginBottom={2}>
                      <Textarea
                        autosize
                        autoFocus
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                      />
                    </Element>
                    <Element
                      css={css({
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridGap: 2,
                      })}
                    >
                      <Button
                        variant="link"
                        onClick={() => {
                          if (isOptimistic) {
                            closeDialog();
                          } else {
                            setEdit(false);
                          }
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        disabled={!editValue}
                        variant="secondary"
                        onClick={async () => {
                          await actions.comments.updateComment({
                            commentId: comment.id,
                            content: editValue,
                          });
                          setEdit(false);
                        }}
                      >
                        Save
                      </Button>
                    </Element>
                  </>
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
