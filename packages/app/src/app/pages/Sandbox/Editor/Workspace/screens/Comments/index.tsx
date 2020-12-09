import { CommentsFilterOption, UserQuery } from '@codesandbox/common/lib/types';
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

import { AddComment } from './AddComment';
import { Comment } from './Comment';

export const Comments: React.FC = () => {
  const {
    state: {
      comments: {
        selectedCommentsFilter,
        currentComments,
        currentCommentsByDate,
      },
    },
    actions: { comments: commentsActions },
  } = useOvermind();
  const scrollRef = React.useRef(null);
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

  const getFilterName = () => {
    switch (selectedCommentsFilter) {
      case CommentsFilterOption.ALL:
        return 'All';
      case CommentsFilterOption.RESOLVED:
        return 'Resolved';
      case CommentsFilterOption.OPEN:
        return 'Open';
      default:
        return 'new';
    }
  };

  const onSubmit = (
    value: string,
    mentions: { [username: string]: UserQuery },
    images: {
      [fileName: string]: { src: string; resolution: [number, number] };
    }
  ) => {
    commentsActions.saveNewComment({
      content: value,
      mentions,
      images,
    });
    scrollRef.current.scrollTop = 0;
  };

  const iconColor =
    selectedCommentsFilter !== CommentsFilterOption.ALL
      ? 'button.background'
      : 'inherit';

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
          <Text>
            Comments
            <Text css={{ textTransform: 'capitalize' }}>
              {' '}
              ({getFilterName()})
            </Text>
          </Text>
          <Menu>
            <Menu.IconButton
              className="icon-button"
              name="filter"
              title="Filter comments"
              size={12}
              css={css({
                color: iconColor,
                ':hover:not(:disabled)': {
                  color: iconColor,
                },
                ':focus:not(:disabled)': {
                  color: iconColor,
                  backgroundColor: 'transparent',
                },
              })}
            />
            <Menu.List>
              {options.map(option => (
                <Menu.Item
                  key={option}
                  onSelect={() => commentsActions.selectCommentsFilter(option)}
                >
                  {option}
                </Menu.Item>
              ))}
            </Menu.List>
          </Menu>
        </SidebarRow>

        {currentComments.length ? (
          <List
            itemProp="mainEntity"
            itemScope
            itemType="http://schema.org/Conversation"
            ref={scrollRef}
            marginTop={4}
            css={{
              // stretch within container, leaving space for comment box
              height: 'calc(100% - 32px)',
              overflow: 'auto',
              scrollBehavior: 'smooth',
            }}
          >
            {currentCommentsByDate.today.length ? (
              <>
                <Text size={3} weight="bold" block margin={2}>
                  Today
                </Text>
                {currentCommentsByDate.today.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </>
            ) : null}
            {currentCommentsByDate.prev.length ? (
              <>
                <Text size={3} weight="bold" block margin={2} marginTop={4}>
                  Earlier
                </Text>
                {currentCommentsByDate.prev.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </>
            ) : null}
          </List>
        ) : null}
      </div>
      {currentComments.length ? null : <Empty />}
      <AddComment onSubmit={onSubmit} />
    </Stack>
  );
};
