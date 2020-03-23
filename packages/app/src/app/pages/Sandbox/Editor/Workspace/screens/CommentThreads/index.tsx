import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import {
  Icon,
  List,
  Menu,
  SidebarRow,
  Stack,
  Text,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { AddCommentThread } from './AddCommentThread';
import { CommentThread } from './CommentThread';
import { CommentDialog } from './Dialog';

export const CommentThreads: React.FC = () => {
  const {
    state: {
      editor: {
        selectedCommentsFilter,
        currentCommentThreads,
        currentCommentThreadId,
      },
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

  const selectedCommentRef = React.createRef();

  const Empty = () => (
    <Stack
      direction="vertical"
      align="center"
      justify="center"
      gap={8}
      marginX={2}
    >
      <Icon
        name="comments"
        size={80}
        color="mutedForeground"
        css={{ opacity: 0.2 }}
      />
      <div>
        <Text block align="center" variant="muted">
          There are no {getSelectedFilter()} comments.
        </Text>
        <Text block align="center" variant="muted">
          Comment on code by clicking within a file, or add a comment below.
        </Text>
      </div>
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
              size={12}
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

        {currentCommentThreads.length ? (
          <List
            marginTop={4}
            css={{
              // stretch within container, leaving space for comment box
              height: 'calc(100% - 32px)',
              overflow: 'auto',
            }}
          >
            {currentCommentThreads.map(commentThread => (
              <CommentThread
                key={commentThread.id}
                commentThread={commentThread}
                innerRef={
                  commentThread.id === currentCommentThreadId
                    ? selectedCommentRef
                    : null
                }
              />
            ))}
          </List>
        ) : null}
      </div>
      {currentCommentThreads.length ? null : <Empty />}
      <AddCommentThread />
      {currentCommentThreadId && (
        <CommentDialog triggerRef={selectedCommentRef} />
      )}
    </Stack>
  );
};
