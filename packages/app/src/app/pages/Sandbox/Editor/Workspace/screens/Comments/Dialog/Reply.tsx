import { Element, Menu, SkeletonText, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { Markdown } from 'app/components/Markdown';
import { DIALOG_TRANSITION_DURATION } from 'app/constants';
import { CommentFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import {
  convertImageReferencesToMarkdownImages,
  convertUserReferencesToMentions,
} from 'app/overmind/utils/comments';
import React, { useState } from 'react';

import { AvatarBlock } from '../components/AvatarBlock';
import { EditComment } from '../components/EditComment';

type ReplyProps = {
  reply: CommentFragment;
};

const animationDelay = DIALOG_TRANSITION_DURATION + 's';

export const Reply = ({ reply }: ReplyProps) => {
  const { state, actions } = useOvermind();
  const [editing, setEditing] = useState(false);
  const { user, id, content } = reply;

  return (
    <Element
      as="li"
      css={{
        '&:last-child > div': {
          border: 'none',
        },
      }}
    >
      <Element
        as="article"
        itemProp="comment"
        itemScope
        itemType="http://schema.org/Comment"
        key={id}
        marginLeft={4}
        marginRight={2}
        paddingTop={6}
      >
        <Stack align="flex-start" justify="space-between" marginBottom={4}>
          <AvatarBlock comment={reply} />
          {state.user.id === user.id && (
            <Stack align="center">
              <Menu>
                <Menu.IconButton name="more" title="Reply actions" size={12} />
                <Menu.List>
                  <Menu.Item
                    onSelect={() => {
                      actions.comments.deleteComment({
                        commentId: id,
                      });
                    }}
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
          position: 'relative',
        })}
      >
        {!editing ? (
          <Element itemProp="text">
            <Markdown
              source={convertImageReferencesToMarkdownImages(
                content,
                reply.references
              )}
            />
          </Element>
        ) : (
          <EditComment
            initialValue={reply.content}
            initialMentions={convertUserReferencesToMentions(reply.references)}
            onSave={async (newValue, mentions, images) => {
              await actions.comments.updateComment({
                commentId: reply.id,
                content: newValue,
                mentions,
                images,
              });
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}
      </Element>
    </Element>
  );
};

export const SkeletonReply = props => (
  <Element marginX={4} paddingTop={6} {...props}>
    <Stack align="center" gap={2} marginBottom={4}>
      <SkeletonText style={{ width: '32px', height: '32px', animationDelay }} />

      <Stack direction="vertical" gap={1}>
        <SkeletonText
          style={{ width: '120px', height: '14px', animationDelay }}
        />
        <SkeletonText
          style={{ width: '120px', height: '14px', animationDelay }}
        />
      </Stack>
    </Stack>

    <Stack direction="vertical" gap={1} marginBottom={6}>
      <SkeletonText style={{ width: '100%', height: '14px', animationDelay }} />
      <SkeletonText style={{ width: '100%', height: '14px', animationDelay }} />
      <SkeletonText style={{ width: '100%', height: '14px', animationDelay }} />
    </Stack>
  </Element>
);
