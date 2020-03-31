import { Element, Text } from '@codesandbox/components';
import OutsideClickHandler from 'react-outside-click-handler';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import React from 'react';

type MultiCommentProps = {
  x: number;
  y: number;
  ids: string[];
};

export const MultiComment = ({ x, y, ids }: MultiCommentProps) => {
  const {
    state: { editor, comments },
    actions,
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
    textAlign: 'left',
    '&:hover': {
      color: 'list.hoverForeground',
      backgroundColor: 'list.hoverBackground',
    },
  });

  const date = comment =>
    formatDistanceStrict(
      zonedTimeToUtc(comment.insertedAt, 'Etc/UTC'),
      new Date(),
      {
        addSuffix: true,
      }
    );

  return (
    <Element css={css({ position: 'absolute' })}>
      <OutsideClickHandler
        onOutsideClick={() => actions.comments.closeMultiCommentsSelector()}
      >
        <Element as="ul" css={list}>
          {ids
            .map(id => comments.comments[editor.currentSandbox.id][id])
            .sort((commentA, commentB) => {
              const dateA = new Date(commentA.insertedAt);
              const dateB = new Date(commentB.insertedAt);
              if (dateA < dateB) {
                return 1;
              }

              if (dateA > dateB) {
                return -1;
              }

              return 0;
            })
            .map(comment => (
              <Element as="li" key={comment.id}>
                <Element
                  as="button"
                  type="button"
                  onClick={event => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    actions.comments.selectComment({
                      commentId: comment.id,
                      bounds: {
                        left: bounds.left,
                        right: bounds.right,
                        top: bounds.top,
                        bottom: bounds.bottom,
                      },
                    });
                  }}
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
            ))}
        </Element>
      </OutsideClickHandler>
    </Element>
  );
};
