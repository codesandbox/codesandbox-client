import {
  Avatar,
  Element,
  Icon,
  Link,
  ListAction,
  Menu,
  Stack,
  Text,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { CommentThread as TCommentThread } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { formatDistance } from 'date-fns';
import React from 'react';

export const CommentThread = React.memo<{ commentThread: TCommentThread }>(
  ({ commentThread }) => {
    const { state, actions } = useOvermind();

    const truncateText = {
      maxHeight: 52,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
      display: 'block',
      // @ts-ignore
      // eslint-disable-next-line no-dupe-keys
      display: '-webkit-box',
      '-webkit-line-clamp': '3',
      '-webkit-box-orient': 'vertical',
    };

    return (
      <ListAction
        key={commentThread.id}
        paddingTop={4}
        css={css({
          display: 'block',
          color: 'inherit',
          transition: 'opacity',
          transitionDuration: theme => theme.speeds[1],
          opacity: commentThread.isResolved ? 0.2 : 1,
          paddingRight: 0, // the actions menu should be at the edge
        })}
      >
        <Stack align="flex-start" justify="space-between" marginBottom={4}>
          <Stack
            gap={2}
            align="center"
            onClick={() => actions.editor.selectCommentThread(commentThread.id)}
          >
            <Avatar user={commentThread.initialComment.user} />
            <Stack direction="vertical" justify="center">
              <Link
                size={3}
                weight="bold"
                href={`/u/${commentThread.initialComment.user.username}`}
                variant="body"
              >
                {commentThread.initialComment.user.username}
              </Link>
              <Text size={2} variant="muted">
                {formatDistance(
                  new Date(commentThread.insertedAt),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}
              </Text>
            </Stack>
          </Stack>
          <Stack align="center">
            {commentThread.isResolved && (
              <Icon name="check" title="Resolved" color="green" />
            )}
            <Menu>
              <Menu.IconButton name="more" title="Comment actions" size={12} />
              <Menu.List>
                <Menu.Item
                  onSelect={() =>
                    actions.editor.resolveCommentThread({
                      commentThreadId: commentThread.id,
                      isResolved: !commentThread.isResolved,
                    })
                  }
                >
                  Mark as {commentThread.isResolved ? 'Unr' : 'r'}esolved
                </Menu.Item>
                <Menu.Item onSelect={() => {}}>Share Comment</Menu.Item>
                {state.user.id === commentThread.initialComment.user.id && (
                  <Menu.Item
                    onSelect={() =>
                      actions.editor.deleteComment({
                        threadId: commentThread.id,
                        commentId: commentThread.initialComment.id,
                      })
                    }
                  >
                    Delete
                  </Menu.Item>
                )}
              </Menu.List>
            </Menu>
          </Stack>
        </Stack>
        <Element
          onClick={() => actions.editor.selectCommentThread(commentThread.id)}
          as="p"
          marginY={0}
          marginRight={2 /** Adjust for the missing margin in ListAction */}
          paddingBottom={
            6 /** Use padding instead of margin for inset border */
          }
          css={css({
            borderBottom: '1px solid',
            borderColor: 'sideBar.border',
          })}
        >
          <Text block css={truncateText} marginBottom={2}>
            {commentThread.initialComment.content}
          </Text>
          <Text variant="muted" size={2}>
            {getRepliesString(commentThread.comments.length)}
          </Text>
        </Element>
      </ListAction>
    );
  }
);

const getRepliesString = length => {
  if (length === 0) return 'No Replies';
  if (length === 1) return '1 Reply';
  return length + ' Replies';
};
