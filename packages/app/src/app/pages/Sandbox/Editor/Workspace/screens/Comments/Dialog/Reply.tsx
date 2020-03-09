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
      <Element key={id} marginLeft={4} marginRight={2} paddingTop={6}>
        <Stack align="flex-start" justify="space-between" marginBottom={4}>
          <Stack gap={2} align="center">
            <Avatar user={author} />
            <Stack direction="vertical" justify="center" gap={1}>
              <Link
                size={3}
                weight="bold"
                href={`/u/${author.username}`}
                variant="body"
              >
                {author.username}
              </Link>
              <Text size={2} variant="muted">
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
        <Comment source={content} />
      </Element>
    </>
  );
};
