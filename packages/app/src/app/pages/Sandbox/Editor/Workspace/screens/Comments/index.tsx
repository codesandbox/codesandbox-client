import { CommentsFilterOption } from '@codesandbox/common/lib/types';
import { List, Menu, Stack, Text } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { json } from 'overmind';
import React, { useState } from 'react';

import { AddComment } from './AddComment';
import { Comment } from './Comment';
import { CommentIcon, FilterIcon } from './icons';
import { useDimensions } from './useDimensions';

export const Comments: React.FC = () => {
  const { state, actions } = useOvermind();
  const [ref, { width }] = useDimensions();
  const options = Object.values(CommentsFilterOption);
  const selectedCommentsFilter = state.editor.selectedCommentsFilter;
  const stateComments = state.editor.currentComments;

  const getText = () => {
    if (selectedCommentsFilter === CommentsFilterOption.ALL) {
      return 'new';
    }
    if (selectedCommentsFilter === CommentsFilterOption.OPEN) {
      return 'open';
    }
    if (selectedCommentsFilter === CommentsFilterOption.RESOLVED) {
      return 'resolved';
    }

    return null;
  };

  const Empty = () => (
    <Stack
      align="center"
      justify="center"
      direction="vertical"
      css={css({
        height: '100%',
      })}
    >
      <CommentIcon />
      <Text align="center" block marginTop={8}>
        There are no {getText()} comments.{' '}
        {selectedCommentsFilter === CommentsFilterOption.OPEN ||
          (selectedCommentsFilter === CommentsFilterOption.ALL && (
            <>
              {/* Leave a comment by clicking anywhere within a file or */}
              Write a global comment below.
            </>
          ))}
      </Text>
    </Stack>
  );

  return (
    <Stack
      direction="vertical"
      css={css({
        height: '100%',
        position: 'relative',
      })}
      ref={ref}
    >
      <Stack
        align="center"
        justify="space-between"
        css={css({
          borderBottom: '1px solid',
          borderColor: 'sideBar.border',
          height: 8,
          paddingLeft: 2,
          width: '100%',
        })}
      >
        <Text variant="body" weight="semibold">
          Comments
        </Text>
        <Stack
          justify="flex-end"
          align="center"
          css={{ '> *': { lineHeight: 1 } }}
        >
          <Menu>
            <Menu.Button
              css={css({
                height: 'auto',
              })}
            >
              <FilterIcon />
            </Menu.Button>
            <Menu.List>
              {options.map(option => (
                <Menu.Item
                  onSelect={() => actions.editor.selectCommentsFilter(option)}
                >
                  {option}
                </Menu.Item>
              ))}
            </Menu.List>
          </Menu>
        </Stack>
      </Stack>
      {stateComments.length ? (
        <List marginTop={4}>
          {stateComments.length ? (
            stateComments.map(comment => <Comment comment={comment} />)
          ) : (
            <Empty />
          )}
        </List>
      ) : (
        <Empty />
      )}
      <AddComment width={width} />
    </Stack>
  );
};
