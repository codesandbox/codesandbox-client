import React from 'react';
import { Stack, Text, ListAction, Link, Menu } from '@codesandbox/components';
import { formatDistance } from 'date-fns';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { MoreIcon, ResolvedIcon } from './icons';

// @ts-ignore
export const Comment = React.memo(({ comment }) => {
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
      <Stack align="center" justify="space-between">
        <Stack
          gap={1}
          align="center"
          css={{
            transition: 'opacity',
            transitionDuration: theme => theme.speeds[1],
            opacity: comment.isResolved ? 0.2 : 1,
          }}
        >
          <img
            css={css({
              border: '1px solid',
              borderColor: 'sideBar.border',
              height: 8,
              width: 8,
              borderRadius: 'small',
            })}
            src={comment.originalMessage.author.avatarUrl}
            alt={comment.originalMessage.author.username}
          />
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
      <Text block marginTop={4} css={truncateText}>
        {comment.originalMessage.content}
      </Text>
      <Text
        css={{
          transition: 'opacity',
          transitionDuration: theme => theme.speeds[1],
          opacity: comment.isResolved ? 0.2 : 1,
        }}
        block
        variant="muted"
        marginTop={2}
      >
        {comment.replies.length} Repl
        {comment.replies.length > 1 || comment.replies.length === 0
          ? 'ies'
          : 'y'}
      </Text>
    </ListAction>
  );
});
