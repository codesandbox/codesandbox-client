import React from 'react';
import { Stack, Text, ListAction, Link } from '@codesandbox/components';
import { formatDistance } from 'date-fns';
import { css } from '@styled-system/css';

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

export const Comment = ({ comment }) => (
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
    <Stack gap={1} align="center">
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
      <Stack direction="vertical" align="center">
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
    <Text block marginTop={4} css={truncateText}>
      {comment.originalMessage.content}
    </Text>
    <Text block variant="muted" marginTop={2}>
      {comment.replies.length} Repl
      {comment.replies.length > 1 || comment.replies.length === 0 ? 'ies' : 'y'}
    </Text>
  </ListAction>
);
