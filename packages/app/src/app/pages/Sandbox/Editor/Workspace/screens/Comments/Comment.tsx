import {
  Element,
  Icon,
  Link,
  ListAction,
  Menu,
  Stack,
  Text,
  isMenuClicked,
} from '@codesandbox/components';
import VisuallyHidden from '@reach/visually-hidden';
import { css } from '@styled-system/css';
import { Markdown } from 'app/components/Markdown';
import { CodeReferenceMetadata, CommentFragment } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { convertImageReferencesToMarkdownImages } from 'app/overmind/utils/comments';
import React from 'react';

import { AvatarBlock } from './components/AvatarBlock';

export const Comment = React.memo<{
  comment: CommentFragment;
}>(({ comment }) => {
  const { state, actions } = useOvermind();

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
      paddingTop={4}
      css={css({
        display: 'block',
        color: 'inherit',
        transition: 'opacity',
        transitionDuration: theme => theme.speeds[1],
        opacity: comment.isResolved ? 0.2 : 1,
        paddingRight: 0, // the actions menu should be at the edge
      })}
      id={comment.id}
      onClick={event => {
        // don't trigger comment if you click on the menu
        // we have to handle this because of an upstream
        // bug in reach/menu-button
        if (isMenuClicked(event)) return;

        const currentTarget = event.currentTarget as HTMLElement;
        const boundingRect = currentTarget.getBoundingClientRect();
        actions.comments.selectComment({
          commentId: comment.id,
          bounds: {
            left: boundingRect.left,
            right: boundingRect.right,
            top: boundingRect.top,
            bottom: boundingRect.bottom,
          },
        });
      }}
    >
      <Element
        as="article"
        itemProp="comment"
        itemScope
        itemType="http://schema.org/Comment"
      >
        <Stack align="flex-start" justify="space-between" marginBottom={2}>
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
                  Mark as {comment.isResolved ? 'unresolved' : 'resolved'}
                </Menu.Item>
                <Menu.Item
                  onSelect={() =>
                    actions.comments.copyPermalinkToClipboard(comment.id)
                  }
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
        <Stack align="center" marginBottom={2} gap={2}>
          {comment.anchorReference && comment.anchorReference.type === 'code' && (
            <Link
              variant="muted"
              css={css({
                opacity: 0.6,
                marginRight: 2,
                display: 'block',
                transition: 'all ease',
                transitionDuration: theme => theme.speeds[1],

                ':hover': {
                  opacity: 1,
                  color: 'sidebar.foreground',
                },
              })}
            >
              {(comment.anchorReference.metadata as CodeReferenceMetadata).path}
            </Link>
          )}
          {comment.anchorReference &&
            comment.anchorReference.type === 'preview' && (
              <Icon name="responsive" title="Preview Comment" size={12} />
            )}
          {comment.replyCount ? (
            <Stack align="center" gap={1}>
              <Icon
                name="comment"
                title="Reply Count"
                size={12}
                css={css({
                  color: 'button.background',
                })}
              />
              {comment.replyCount}
              <VisuallyHidden itemProp="commentCount">
                {comment.replyCount}
              </VisuallyHidden>
            </Stack>
          ) : null}
        </Stack>
        <Element
          as="p"
          marginY={0}
          marginRight={2 /** Adjust for the missing margin in ListAction */}
          paddingBottom={
            6 /** Use padding instead of margin for inset border */
          }
          css={css({
            borderBottom: '1px solid',
            borderColor: 'sideBar.border',
          })}
        >
          <Text itemProp="text" block css={truncateText} marginBottom={2}>
            <Markdown
              source={convertImageReferencesToMarkdownImages(
                comment.content,
                comment.references
              )}
            />
          </Text>
        </Element>
      </Element>
    </ListAction>
  );
});
