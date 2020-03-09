import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import css from '@styled-system/css';
import Draggable from 'react-draggable';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { formatDistance } from 'date-fns';
import {
  Element,
  Stack,
  Avatar,
  Textarea,
  Text,
  Link,
  IconButton,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Comment } from './Comment';
import { Reply } from './Reply';

export const CommentDialog = props =>
  ReactDOM.createPortal(<Dialog {...props} />, document.body);

export const Dialog = props => {
  const { state, actions } = useOvermind();
  const [value, setValue] = useState('');
  const comment = state.editor.currentComment;
  const [position, setPosition] = useState({
    x: props.x || 200,
    y: props.y || 100,
  });

  const closeDialog = () => actions.editor.selectComment(null);
  const onSubmit = () => {
    setValue('');
    if (comment) {
      actions.editor.addReply(value);
    } else {
      actions.editor.addComment({
        comment: value,
        sandboxId: state.editor.currentSandbox.id,
        username: state.user.username,
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

  return (
    <Draggable handle=".handle" position={position} onStop={onDragStop}>
      <Element
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
          overflow: 'auto',
          fontFamily: 'Inter, sans-serif',
          boxShadow: 2,
        })}
      >
        <Stack
          className="handle"
          css={{ cursor: 'move' }}
          align="center"
          justify="space-between"
          padding={4}
          paddingRight={2}
          marginBottom={2}
        >
          <Text size={3} weight="bold">
            Comment
          </Text>
          <Stack align="center">
            <IconButton
              onClick={() =>
                actions.editor.updateComment({
                  id: comment.id,
                  data: { isResolved: !comment.isResolved },
                })
              }
              name="check"
              size={4}
              title="Resolve Comment"
              css={css({
                transition: 'color',
                transitionDuration: theme => theme.speeds[1],
                color: comment.isResolved ? 'green' : 'mutedForeground',
              })}
            />
            <IconButton
              name="cross"
              size={3}
              title="Close comment dialog"
              onClick={closeDialog}
            />
          </Stack>
        </Stack>

        {comment && (
          <>
            <Stack gap={2} align="center" paddingX={4} marginBottom={4}>
              <Avatar user={comment.originalMessage.author} />
              <Stack direction="vertical" justify="center" gap={1}>
                <Link
                  size={3}
                  weight="bold"
                  href={`/u/${comment.originalMessage.author.username}`}
                  variant="body"
                >
                  {comment.originalMessage.author.username}
                </Link>
                <Text size={2} variant="muted">
                  {formatDistance(new Date(comment.insertedAt), new Date(), {
                    addSuffix: true,
                  })}
                </Text>
              </Stack>
            </Stack>
            <Element
              as="p"
              marginY={0}
              marginX={4}
              paddingBottom={6}
              css={css({
                borderBottom: '1px solid',
                borderColor: 'sideBar.border',
              })}
            >
              <Comment source={comment.originalMessage.content} />
            </Element>
          </>
        )}

        {comment &&
          comment.replies.map(reply => (
            <Reply {...reply} commentId={comment.id} />
          ))}

        <Element
          css={css({
            borderTop: '1px solid',
            borderColor: 'sideBar.border',
          })}
        >
          <Textarea
            autosize
            css={css({
              overflow: 'hidden',

              border: 'none',
              display: 'block',
            })}
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={comment ? 'Reply' : 'Write a comment...'}
            onKeyDown={event => {
              if (event.keyCode === ENTER && !event.shiftKey) onSubmit();
            }}
          />
        </Element>
      </Element>
    </Draggable>
  );
};
