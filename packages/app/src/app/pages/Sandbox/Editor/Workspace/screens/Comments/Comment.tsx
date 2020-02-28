import {
  Avatar,
  Link,
  ListAction,
  Menu,
  Stack,
  Text,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { formatDistance } from 'date-fns';
import React from 'react';

import { MoreIcon, ResolvedIcon } from './icons';

export const Comment = React.memo(({ comment }: any) => {
  const { state, actions } = useOvermind();

  const truncateText = {
    transition: 'opacity',
    transitionDuration: theme => theme.speeds[1],
    opacity: comment.isResolved ? 0.2 : 1,
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
      paddingBottom={6}
      paddingTop={6}
      css={css({
        display: 'block',
        color: 'inherit',
        borderBottom: '1px solid',
        borderColor: 'sideBar.border',
      })}
    >
      <Stack align="flex-start" justify="space-between" marginBottom={4}>
        <Stack
          gap={2}
          align="center"
          css={{
            transition: 'opacity',
            transitionDuration: theme => theme.speeds[1],
            opacity: comment.isResolved ? 0.2 : 1,
          }}
        >
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
        <Stack>
          {comment.isResolved && <ResolvedIcon />}
          <Menu>
            <Menu.Button
              css={css({
                height: 'auto',
              })}
            >
              <MoreIcon />
            </Menu.Button>
            <Menu.List>
              <Menu.Item
                onSelect={() =>
                  actions.editor.updateComment({
                    id: comment.id,
                    data: {
                      isResolved: !comment.isResolved,
                    },
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
      <Text block css={truncateText} marginBottom={2}>
        {comment.originalMessage.content}
      </Text>
      <Text
        css={{
          transition: 'opacity',
          transitionDuration: theme => theme.speeds[1],
          opacity: comment.isResolved ? 0.2 : 1,
        }}
        variant="muted"
        size={2}
      >
        {getPrettyReplyString(comment.replies.length)}
      </Text>
    </ListAction>
  );
});

const getPrettyReplyString = length => {
  if (length === 0) return 'No Replies';
  if (length === 1) return '1 Reply';
  return length + ' Replies';
};
