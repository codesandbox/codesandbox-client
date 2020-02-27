import { formatDistance } from 'date-fns';
import { useOvermind } from 'app/overmind';
import React, { useState, useEffect } from 'react';
import { Stack, Text, Menu, Element } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { json } from 'overmind';
import { FilterIcon } from './icons';

export const Comments: React.FC = () => {
  const { state } = useOvermind();
  const options = ['All', 'Open', 'Resolved', 'Mentions'];
  const [selected, select] = useState(options[0]);
  const stateComments = json(
    state.editor.comments[state.editor.currentSandbox.id]
  );
  const [comments, setComments] = useState(stateComments);

  useEffect(() => {
    if (selected === 'All') {
      setComments(stateComments);
    }

    if (selected === 'Open') {
      setComments(stateComments.filter(comment => !comment.isResolved));
    }

    if (selected === 'Resolved') {
      setComments(stateComments.filter(comment => comment.isResolved));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  if (!state.editor.currentSandbox) {
    return null;
  }

  return (
    <Stack direction="vertical">
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
            <Menu.Button>
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
      <Element marginTop={4}>
        {comments.map(comment => (
          <Element
            key={comment.id}
            paddingX={2}
            paddingBottom={6}
            marginBottom={6}
            css={css({
              color: 'inherit',
              borderBottom: '1px solid',
              borderColor: 'sideBar.border',
            })}
          >
            <Stack gap={1} align="center">
              <img
                css={css({
                  border: '1px solid',
                  borderColor: 'sideBar.border',
                  height: 8,
                  width: 8,
                })}
                src={comment.originalMessage.author.avatarUrl}
                alt={comment.originalMessage.author.username}
              />
              <Stack direction="vertical" align="center">
                <Text variant="body" weight="bold" block>
                  {comment.originalMessage.author.username}
                </Text>
                <Text size={12} variant="muted">
                  {formatDistance(new Date(comment.insertedAt), new Date(), {
                    addSuffix: true,
                  })}
                </Text>
              </Stack>
            </Stack>
            <Text block marginTop={4}>
              {comment.originalMessage.content}
            </Text>
            <Text block variant="muted" marginTop={2}>
              {comment.replies.length} Repl
              {comment.replies.length > 1 || comment.replies.length === 0
                ? 'ies'
                : 'y'}
            </Text>
          </Element>
        ))}
      </Element>
    </Stack>
  );
};

// {"id":"5e5527f6c277a40fef1e38ff","isResolved":false,"originalMessage":{"id":"2ze9n1hak71ygeza","content":"New Comment","author":{"avatarUrl":"https://avatars0.githubusercontent.com/u/1051509?v=4","username":"SaraVieira"}},"replies":[],"insertedAt":"2020-02-25T13:58:14.154Z","updatedAt":"2020-02-25T13:58:14.154Z"}
