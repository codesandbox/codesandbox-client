import {
  Avatar,
  Button,
  Element,
  Link,
  Menu,
  Stack,
  Text,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Comment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { formatDistance } from 'date-fns';
import React, { useState } from 'react';

import { Markdown } from './Markdown';

type ReplyProps = {
  threadId: string;
  reply: Comment;
};

export const Reply = ({
  threadId,
  reply: { user, insertedAt, id, content },
}: ReplyProps) => {
  const { state, actions } = useOvermind();
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(content);
  return (
    <>
      <Element key={id} marginLeft={4} marginRight={2} paddingTop={6}>
        <Stack align="flex-start" justify="space-between" marginBottom={4}>
          <Stack gap={2} align="center">
            <Avatar user={user} />
            <Stack direction="vertical" justify="center" gap={1}>
              <Link
                size={3}
                weight="bold"
                href={`/u/${user.username}`}
                variant="body"
              >
                {user.username}
              </Link>
              <Text size={2} variant="muted">
                {formatDistance(new Date(insertedAt), new Date(), {
                  addSuffix: true,
                })}
              </Text>
            </Stack>
          </Stack>
          {state.user.id === user.id && (
            <Stack align="center">
              <Menu>
                <Menu.IconButton name="more" title="Reply actions" size={12} />
                <Menu.List>
                  <Menu.Item
                    onSelect={() =>
                      actions.editor.deleteComment({
                        threadId,
                        commentId: id,
                        reply: true,
                      })
                    }
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Item onSelect={() => setEdit(true)}>
                    Edit Reply
                  </Menu.Item>
                </Menu.List>
              </Menu>
            </Stack>
          )}
        </Stack>
      </Element>
      <Element
        as={edit ? 'div' : 'p'}
        marginY={0}
        marginX={4}
        paddingBottom={6}
        css={css({
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        {!edit ? (
          <Markdown source={content} />
        ) : (
          <>
            <Element marginBottom={2}>
              <Textarea
                autosize
                value={value}
                onChange={e => setValue(e.target.value)}
              />
            </Element>
            <Element
              css={css({
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridGap: 2,
              })}
            >
              <Button variant="link" onClick={() => setEdit(false)}>
                Cancel
              </Button>

              <Button
                variant="secondary"
                disabled={!value}
                onClick={async () => {
                  await actions.editor.updateComment({
                    threadId,
                    commentId: id,
                    content: value,
                    reply: true,
                  });
                  setEdit(false);
                }}
              >
                Save
              </Button>
            </Element>
          </>
        )}
      </Element>
    </>
  );
};
