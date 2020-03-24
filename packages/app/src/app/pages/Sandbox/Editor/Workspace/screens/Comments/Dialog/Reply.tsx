import {
  Button,
  Element,
  Menu,
  Stack,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { CommentFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import React, { useState } from 'react';

import { Markdown } from './Markdown';
import { AvatarBlock } from '../components/AvatarBlock';

type ReplyProps = {
  reply: CommentFragment;
};

export const Reply = ({ reply }: ReplyProps) => {
  const { user, id, content } = reply;
  const { state, actions } = useOvermind();
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(content);
  return (
    <>
      <Element key={id} marginLeft={4} marginRight={2} paddingTop={6}>
        <Stack align="flex-start" justify="space-between" marginBottom={4}>
          <AvatarBlock comment={reply} />
          {state.user.id === user.id && (
            <Stack align="center">
              <Menu>
                <Menu.IconButton name="more" title="Reply actions" size={12} />
                <Menu.List>
                  <Menu.Item
                    onSelect={() =>
                      actions.comments.deleteComment({
                        commentId: id,
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
                  await actions.comments.updateComment({
                    commentId: id,
                    content: value,
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
