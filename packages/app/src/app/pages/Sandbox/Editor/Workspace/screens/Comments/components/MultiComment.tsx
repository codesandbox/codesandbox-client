import React from 'react';
import { formatDistanceStrict } from 'date-fns';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Text, Element } from '@codesandbox/components';

type MultiCommentProps = {
  x: number;
  y: number;
  ids: string[];
};

export const MultiComment = ({ x, y, ids }: MultiCommentProps) => {
  const {
    state: {
      comments: { currentComments },
    },
    actions: { comments },
  } = useOvermind();

  const list = css({
    position: 'fixed',
    left: x - 10,
    top: y + 20,
    backgroundColor: 'sideBar.background',
    border: '1px solid',
    borderColor: 'sideBar.border',
    paddingY: 2,
    paddingX: 0,
    zIndex: 999999999999999,
    listStyle: 'none',
    borderRadius: 4,

    '&::before': {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: '7px',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      top: '-11px',
      borderColor: 'transparent',
      borderBottomColor: 'sideBar.border',

      borderWidth: '11px',
      borderTopWidth: 0,
    },

    '&::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: 2,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      top: '-10px',
      borderColor: 'transparent',
      borderBottomColor: 'sideBar.background',
      borderWidth: '10px',
      borderTopWidth: 0,
    },
  });

  const item = css({
    border: 'none',
    backgroundColor: 'transparent',
    padding: 2,
    width: 200,
    cursor: 'pointer',
    position: 'relative',
    '&:hover': {
      color: 'list.hoverForeground',
      backgroundColor: 'list.hoverBackground',
    },
  });

  const date = comment =>
    formatDistanceStrict(new Date(comment.insertedAt), new Date(), {
      addSuffix: true,
    });

  return (
    <Element as="ul" css={list}>
      {ids.map(id => {
        const comment = currentComments.find(c => c.id === id);
        return (
          <Element as="li" key={id}>
            <Element
              as="button"
              type="button"
              // @ts-ignore
              onClick={() => comments.selectComment(id)}
              css={item}
            >
              <Text
                size={2}
                weight="bold"
                paddingRight={2}
                css={css({
                  color: 'sideBar.foreground',
                })}
              >
                {comment.user.username}
              </Text>
              <Text size={2} variant="muted">
                {date(comment)}
              </Text>
            </Element>
          </Element>
        );
      })}
    </Element>
  );
};
