import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import {
  List,
  Menu,
  Stack,
  Text,
  SidebarRow,
  Icon,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { AddComment } from './AddComment';
import { Comment } from './Comment';
import { CommentDialog } from './Dialog';

export const Comments: React.FC = () => {
  const {
    state: {
      editor: { selectedCommentsFilter, currentComments, currentCommentId },
    },
    actions: { editor: editorActions },
  } = useOvermind();
  const options = Object.values(CommentsFilterOption);

  const getSelectedFilter = () => {
    switch (selectedCommentsFilter) {
      case CommentsFilterOption.ALL || CommentsFilterOption.OPEN:
        return 'new';
      case CommentsFilterOption.RESOLVED:
        return 'resolved';
      default:
        return 'new';
    }
  };

  const all =
    selectedCommentsFilter === CommentsFilterOption.OPEN ||
    selectedCommentsFilter === CommentsFilterOption.ALL;

  const Empty = () => (
    <Stack direction="vertical" align="center" justify="center" gap={8}>
      <Icon
        name="comments"
        size={20}
        color="mutedForeground"
        css={{ opacity: 0.2 }}
      />
      <Text block align="center" variant="muted">
        There are no {getSelectedFilter()} comments.{' '}
        {all && (
          <>
            {/* Leave a comment by clicking anywhere within a file or */}
            Write a global comment below.
          </>
        )}
      </Text>
    </Stack>
  );

  return (
    <Stack
      direction="vertical"
      justify="space-between"
      css={{ height: '100%' }}
    >
      <div css={{ overflow: 'hidden' }}>
        <SidebarRow
          justify="space-between"
          paddingX={2}
          css={css({
            borderBottom: '1px solid',
            borderColor: 'sideBar.border',
            minHeight: '35px',
          })}
        >
          <Text>Comments</Text>
          <Menu>
            <Menu.IconButton
              className="icon-button"
              name="filter"
              title="Filter comments"
              size={3}
            />
            <Menu.List>
              {options.map(option => (
                <Menu.Item
                  key={option}
                  onSelect={() => editorActions.selectCommentsFilter(option)}
                >
                  {option}
                </Menu.Item>
              ))}
            </Menu.List>
          </Menu>
        </SidebarRow>

        {currentComments.length ? (
          <List marginTop={4} css={{ height: '100%', overflow: 'scroll' }}>
            {currentComments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </List>
        ) : null}
      </div>
      {currentComments.length ? null : <Empty />}
      <AddComment />
      {currentCommentId && <CommentDialog />}
    </Stack>
  );
};
