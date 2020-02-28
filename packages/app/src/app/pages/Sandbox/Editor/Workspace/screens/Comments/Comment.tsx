import {
  Element,
  Avatar,
  Link,
  ListAction,
  Menu,
  Stack,
  Text,
  Icon,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { formatDistance } from 'date-fns';
import React from 'react';

export const Comment = React.memo(({ comment }: any) => {
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
      onClick={() => actions.editor.selectComment(comment.id)}
      key={comment.id}
      paddingTop={5}
      css={css({
        display: 'block',
        color: 'inherit',
        transition: 'opacity',
        transitionDuration: theme => theme.speeds[1],
        opacity: comment.isResolved ? 0.2 : 1,
        paddingRight: 0, // the actions menu should be at the edge
      })}
    >
      <Stack align="flex-start" justify="space-between" marginBottom={4}>
        <Stack gap={2} align="center">
          <Avatar user={comment.originalMessage.author} />
          <Stack direction="vertical" justify="center">
            <Link
              href={`/u/${comment.originalMessage.author.username}`}
              variant="body"
              css={{ fontWeight: 'bold', display: 'block' }}
            >
              {comment.originalMessage.author.username}
            </Link>
            <Text size={12} variant="muted">
              {formatDistance(new Date(comment.insertedAt), new Date(), {
                addSuffix: true,
              })}
            </Text>
          </Stack>
        </Stack>
        <Stack align="center">
          {comment.isResolved && (
            <Icon name="check" title="Resolved" color="green" />
          )}
          <Menu>
            <Menu.IconButton name="more" title="Comment actions" size={3} />
            <Menu.List>
              <Menu.Item
                onSelect={() =>
                  actions.editor.updateComment({
                    id: comment.id,
                    data: { isResolved: !comment.isResolved },
                  })
                }
              >
                Mark as {comment.isResolved ? 'Unr' : 'r'}esolved
              </Menu.Item>
              <Menu.Item onSelect={() => {}}>Share Comment</Menu.Item>
              {state.user.id === comment.originalMessage.author.id && (
                <Menu.Item
                  onSelect={() =>
                    actions.editor.deleteComment({ id: comment.id })
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
        as="p"
        marginY={0}
        marginRight={2 /** Adjust for the missing margin in ListAction */}
        paddingBottom={5}
        css={css({
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Text block css={truncateText} marginBottom={2}>
          {comment.originalMessage.content}
        </Text>
        <Text variant="muted" size={2}>
          {getRepliesString(comment.replies.length)}
        </Text>
      </Element>
    </ListAction>
  );
});

const getRepliesString = length => {
  if (length === 0) return 'No Replies';
  if (length === 1) return '1 Reply';
  return length + ' Replies';
};
