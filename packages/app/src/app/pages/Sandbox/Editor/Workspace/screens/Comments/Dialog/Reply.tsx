import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import css from '@styled-system/css';
import {
  Element,
  Button,
  Stack,
  Avatar,
  Text,
  Link,
  Menu,
  Textarea,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Markdown } from './Markdown';

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
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(content);
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
                  await actions.editor.updateReply({
                    replyId: id,
                    commentId,
                    comment: value,
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
