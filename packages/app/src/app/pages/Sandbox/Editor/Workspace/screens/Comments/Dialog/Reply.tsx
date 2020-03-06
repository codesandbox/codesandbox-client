import React from 'react';
import { formatDistance } from 'date-fns';
import css from '@styled-system/css';
import {
  Element,
  Stack,
  Avatar,
  Text,
  Link,
  Menu,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Comment } from './Comment';

type ReplyProps = {
  id: string;
  author?: any;
  insertedAt?: string;
  commentId: string;
  content?: string;
};

export const Reply = ({
  id,
  author,
  insertedAt,
  commentId,
  content,
}: ReplyProps) => {
  const { state, actions } = useOvermind();
  return (
    <>
      <Element
        key={id}
        paddingX={4}
        paddingTop={6}
        css={css({
          borderTop: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Stack align="flex-start" justify="space-between" marginBottom={4}>
          <Stack gap={2} align="center">
            <Avatar user={author} />
            <Stack direction="vertical" justify="center">
              <Link
                href={`/u/${author.username}`}
                variant="body"
                css={{ fontWeight: 'bold', display: 'block' }}
              >
                {author.username}
              </Link>
              <Text size={12} variant="muted">
                {formatDistance(new Date(insertedAt), new Date(), {
                  addSuffix: true,
                })}
              </Text>
            </Stack>
          </Stack>
          {state.user.id === author.id && (
            <Stack align="center">
              <Menu>
                <Menu.IconButton name="more" title="Reply actions" size={3} />
                <Menu.List>
                  <Menu.Item
                    onSelect={() =>
                      actions.editor.deleteReply({
                        replyId: id,
                        commentId,
                      })
                    }
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Item>Edit</Menu.Item>
                </Menu.List>
              </Menu>
            </Stack>
          )}
        </Stack>
      </Element>
      <Comment source={content} />
    </>
  );
};
