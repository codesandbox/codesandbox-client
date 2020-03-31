import { Avatar, Stack, Text } from '@codesandbox/components';
import { CommentFragment } from 'app/graphql/types';
import { formatDistance } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import React from 'react';

export const AvatarBlock: React.FC<{ comment: CommentFragment }> = ({
  comment,
}) => (
  <Stack gap={2} align="center">
    <Avatar user={comment.user} />
    <Stack direction="vertical" justify="center" gap={1}>
      <Text size={3} weight="bold" variant="body">
        {comment.user.username}
      </Text>
      <Text size={2} variant="muted">
        {formatDistance(
          zonedTimeToUtc(comment.insertedAt, 'Etc/UTC'),
          new Date(),
          {
            addSuffix: true,
          }
        )}
      </Text>
    </Stack>
  </Stack>
);
