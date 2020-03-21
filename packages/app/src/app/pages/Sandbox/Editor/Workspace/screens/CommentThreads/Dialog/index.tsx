import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Avatar,
  Button,
  Element,
  IconButton,
  Link,
  Menu,
  Stack,
  Text,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { formatDistance } from 'date-fns';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

import { Markdown } from './Markdown';
import { Reply } from './Reply';
import { useScrollTop } from './use-scroll-top';

export const CommentDialog = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

export const Dialog = props => {
  const { state, actions } = useOvermind();
  const [value, setValue] = useState('');

  const [edit, setEdit] = useState(false);
  const thread = state.comments.currentCommentThread;
  const [editValue, setEditValue] = useState(thread.initialComment.content);
  const [position, setPosition] = useState({
    x: props.x || 200,
    y: props.y || 40,
  });

  const closeDialog = () => actions.comments.selectCommentThread(null);
  const onSubmit = () => {
    setValue('');
    if (thread) {
      actions.comments.addComment(value);
    } else {
      actions.comments.addCommentThread({
        content: value,
        open: true,
      });
    }
  };

  const onDragStop = (_, data) => {
    setPosition({
      x: data.x,
      y: data.y,
    });
  };

  const { ref: listRef, scrollTop } = useScrollTop();

  return (
    <Draggable handle=".handle" position={position} onStop={onDragStop}>
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
                actions.comments.resolveCommentThread({
                  commentThreadId: thread.id,
                  isResolved: !thread.isResolved,
                })
              }
              name="check"
              size={14}
              title="Resolve Comment"
              css={css({
                transition: 'color',
                transitionDuration: theme => theme.speeds[1],
                color: thread.isResolved ? 'green' : 'mutedForeground',
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

        {thread && (
          <Stack direction="vertical" css={{ overflow: 'auto' }} ref={listRef}>
            <Stack direction="vertical" gap={4}>
              <Stack
                align="flex-start"
                justify="space-between"
                marginLeft={4}
                marginRight={2}
              >
                <Stack gap={2} align="center">
                  <Avatar user={thread.initialComment.user} />
                  <Stack direction="vertical" justify="center" gap={1}>
                    <Link
                      size={3}
                      weight="bold"
                      href={`/u/${thread.initialComment.user.username}`}
                      variant="body"
                    >
                      {thread.initialComment.user.username}
                    </Link>
                    <Text size={2} variant="muted">
                      {formatDistance(new Date(thread.insertedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </Text>
                  </Stack>
                </Stack>
                {state.user.id === thread.initialComment.user.id && (
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
                              threadId: thread.id,
                              commentId: thread.initialComment.id,
                            })
                          }
                        >
                          Delete
                        </Menu.Item>
                        <Menu.Item onSelect={() => setEdit(true)}>
                          Edit Comment
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
                  <Markdown source={thread.initialComment.content} />
                ) : (
                  <>
                    <Element marginBottom={2}>
                      <Textarea
                        autosize
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
                      <Button variant="link" onClick={() => setEdit(false)}>
                        Cancel
                      </Button>

                      <Button
                        disabled={!editValue}
                        variant="secondary"
                        onClick={async () => {
                          await actions.comments.updateComment({
                            threadId: thread.id,
                            commentId: thread.initialComment.id,
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
              {thread.comments.map((reply, i) => {
                if (i === 0) return null;
                return <Reply reply={reply} threadId={thread.id} />;
              })}
            </>
          </Stack>
        )}

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
          placeholder={thread ? 'Reply' : 'Write a comment...'}
          onKeyDown={event => {
            if (event.keyCode === ENTER && !event.shiftKey) onSubmit();
          }}
        />
      </Stack>
    </Draggable>
  );
};
