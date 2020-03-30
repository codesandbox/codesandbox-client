import { Element, Menu, Stack, SkeletonText } from '@codesandbox/components';
import css from '@styled-system/css';
import { CommentFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import React, { useState } from 'react';

import { Markdown } from './Markdown';
import { AvatarBlock } from '../components/AvatarBlock';
import { EditComment } from '../components/EditComment';

type ReplyProps = {
  reply: CommentFragment;
};

export const Reply = ({ reply }: ReplyProps) => {
  const { user, id, content } = reply;
  const { state, actions } = useOvermind();
  const [editing, setEditing] = useState(false);

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
                  <Menu.Item onSelect={() => setEditing(true)}>
                    Edit Reply
                  </Menu.Item>
                </Menu.List>
              </Menu>
            </Stack>
          )}
        </Stack>
      </Element>
      <Element
        marginY={0}
        marginX={4}
        paddingBottom={6}
        css={css({
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        {!editing ? (
          <Markdown source={content} />
        ) : (
          <EditComment
            initialValue={reply.content}
            onSave={async newValue => {
              await actions.comments.updateComment({
                commentId: reply.id,
                content: newValue,
              });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}
      </Element>
    </>
  );
};

export const SkeletonReply = props => (
  <Element marginX={4} paddingTop={6} {...props}>
    <Stack align="center" gap={2} marginBottom={4}>
      <SkeletonText style={{ width: '32px', height: '32px' }} />

      <Stack direction="vertical" gap={1}>
        <SkeletonText style={{ width: '120px', height: '14px' }} />
        <SkeletonText style={{ width: '120px', height: '14px' }} />
      </Stack>
    </Stack>

    <Stack direction="vertical" gap={1} marginBottom={6}>
      <SkeletonText style={{ width: '100%', height: '14px' }} />
      <SkeletonText style={{ width: '100%', height: '14px' }} />
      <SkeletonText style={{ width: '100%', height: '14px' }} />
    </Stack>
  </Element>
);
