import {
  Element,
  Icon,
  ListAction,
  Menu,
  Stack,
  Text,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { CommentFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';

import React from 'react';
import { copyToClipboard } from 'app/utils/copy-to-clipboard';
import { AvatarBlock } from './components/AvatarBlock';

export const Comment = React.memo<{
  comment: CommentFragment;
  innerRef: React.RefObject<any>;
}>(({ comment, innerRef }) => {
  const { state, actions, effects } = useOvermind();

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

  return (
    <ListAction
      key={comment.id}
      ref={innerRef}
      paddingTop={4}
      css={css({
        display: 'block',
        color: 'inherit',
        transition: 'opacity',
        transitionDuration: theme => theme.speeds[1],
        opacity: comment.isResolved ? 0.2 : 1,
        paddingRight: 0, // the actions menu should be at the edge
      })}
      onClick={event => {
        const target = event.target as HTMLElement;
        // don't trigger comment if you click on the menu
        // we have to handle this because of an upstream
        // bug in reach/menu-button
        if (target.tagName === 'button' || target.tagName === 'svg') {
          return;
        }

        actions.comments.selectComment(comment.id);
      }}
    >
      <Stack align="flex-start" justify="space-between" marginBottom={4}>
        <AvatarBlock comment={comment} />
        <Stack align="center">
          {comment.isResolved && (
            <Icon name="check" title="Resolved" color="green" />
          )}
          <Menu>
            <Menu.IconButton name="more" title="Comment actions" size={12} />
            <Menu.List>
              <Menu.Item
                onSelect={() =>
                  actions.comments.resolveComment({
                    commentId: comment.id,
                    isResolved: !comment.isResolved,
                  })
                }
              >
                Mark as {comment.isResolved ? 'Unr' : 'r'}esolved
              </Menu.Item>
              <Menu.Item
                onSelect={() => {
                  copyToClipboard(
                    `${window.location.origin}${window.location.pathname}?comment=${comment.id}`
                  );
                  effects.notificationToast.success(
                    'Comment permalink copied to clipboard'
                  );
                }}
              >
                Share Comment
              </Menu.Item>
              {state.user.id === comment.user.id && (
                <Menu.Item
                  onSelect={() =>
                    actions.comments.deleteComment({
                      commentId: comment.id,
                    })
                  }
                >
                  Delete
                </Menu.Item>
              )}
            </Menu.List>
          </Menu>
        </Stack>
      </Stack>
      <Element
        as="p"
        marginY={0}
        marginRight={2 /** Adjust for the missing margin in ListAction */}
        paddingBottom={6 /** Use padding instead of margin for inset border */}
        css={css({
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Text block css={truncateText} marginBottom={2}>
          {comment.content}
        </Text>
        <Text variant="muted" size={2}>
          {getRepliesString(comment.comments.length)}
        </Text>
      </Element>
    </ListAction>
  );
});

const getRepliesString = length => {
  if (length === 0) return 'No Replies';
  if (length === 1) return '1 Reply';
  return length + ' Replies';
};
