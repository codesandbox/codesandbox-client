import React from 'react';
import { Stack, Avatar, Link, Text } from '@codesandbox/components';
import { formatDistance } from 'date-fns';
import { CommentFragment } from 'app/graphql/types';

export const AvatarBlock: React.FC<{ comment: CommentFragment }> = ({
  comment,
}) => (
  <Stack gap={2} align="center">
    <Avatar user={comment.user} />
    <Stack direction="vertical" justify="center" gap={1}>
      <Link
        size={3}
        weight="bold"
        href={`/u/${comment.user.username}`}
        variant="body"
      >
        {comment.user.username}
      </Link>
      <Text size={2} variant="muted">
        {formatDistance(new Date(comment.insertedAt), new Date(), {
          addSuffix: true,
        })}
      </Text>
    </Stack>
  </Stack>
);
