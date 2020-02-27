import { useOvermind } from 'app/overmind';
import React, { useState } from 'react';
import { Stack, Text, Menu, List } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { json } from 'overmind';
import { FilterIcon, CommentIcon } from './icons';
import { Comment } from './Comment';
import { useDimensions } from './useDimensions';
import { AddComment } from './AddComment';

export const Comments: React.FC = () => {
  const { state } = useOvermind();
  const [ref, { width }] = useDimensions();
  const options = ['All', 'Open', 'Resolved', 'Mentions'];
  const [selected, select] = useState(options[0]);
  const stateComments = json(
    state.editor.comments[state.editor.currentSandbox.id]
  );

  const getText = () => {
    if (selected === 'All') {
      return 'new';
    }
    if (selected === 'Open') {
      return 'open';
    }
    if (selected === 'Resolved') {
      return 'resolved';
    }

    return null;
  };

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
                <Menu.Item onSelect={() => select(option)}>{option}</Menu.Item>
              ))}
            </Menu.List>
          </Menu>
        </Stack>
      </Stack>
      {stateComments.length ? (
        <List marginTop={4}>
          {selected === 'All' &&
            // @ts-ignore
            stateComments.map(comment => <Comment comment={comment} />)}
          {selected === 'Open' &&
            stateComments
              .filter(comment => !comment.isResolved)
              // @ts-ignore
              .map(comment => <Comment comment={comment} />)}
          {selected === 'Resolved' &&
            stateComments
              .filter(comment => comment.isResolved)
              // @ts-ignore
              .map(comment => <Comment comment={comment} />)}
        </List>
      ) : (
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
            {selected === 'All' && (
              <>
                {/* Leave a comment by clicking anywhere within a file or */}
                Write a global comment below.
              </>
            )}
          </Text>
        </Stack>
      )}
      <AddComment width={width} />
    </Stack>
  );
};
