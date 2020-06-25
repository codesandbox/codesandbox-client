import { UserQuery } from '@codesandbox/common/lib/types';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { FormField, List, ListAction, Textarea } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { convertMentionLinksToMentions } from 'app/overmind/utils/comments';
import React from 'react';
import { createPortal } from 'react-dom';

import { useMention } from './useMention';

export const useCodesandboxMention = ({
  initialValue,
  initialMentions,
  onSubmit,
}: {
  initialValue: string;
  initialMentions: {
    [mentionName: string]: any;
  };
  onSubmit: (
    value: string,
    mentions: { [username: string]: UserQuery }
  ) => void;
}): [React.ReactElement, string, { [username: string]: UserQuery }] => {
  const ref = React.useRef(null);
  const { state, actions } = useOvermind();
  const [value, setValue, mention, mentions] = useMention(
    ref,
    () => convertMentionLinksToMentions(initialValue),
    initialMentions
  );
  const [menuIndex, setMenuIndex] = React.useState(0);
  const textareaBoundingRect = React.useMemo(
    () => ref.current && ref.current.getBoundingClientRect(),
    // eslint-disable-next-line
    [ref.current]
  );
  const users = state.comments.usersQueryResult;

  React.useEffect(() => {
    actions.comments.queryUsers(mention.query);
  }, [mention.query, actions.comments]);

  React.useEffect(() => {
    if (menuIndex > users.length - 1) {
      setMenuIndex(users.length ? users.length - 1 : 0);
    }
  }, [menuIndex, users.length]);

  const onKeyDown = event => {
    if (mention.query !== null) {
      if (event.keyCode === ENTER) {
        event.preventDefault();
        if (users.length) {
          mention.add(users[menuIndex].username, users[menuIndex]);
        }
      }
      if (event.keyCode === 38) {
        event.preventDefault();
        setMenuIndex(i => (i === 0 ? users.length - 1 : i - 1));
      }
      if (event.keyCode === 40) {
        event.preventDefault();
        setMenuIndex(i => (i === users.length - 1 ? 0 : i + 1));
      }
    } else if (event.keyCode === ENTER && !event.shiftKey) {
      onSubmit(value, mentions);
      setValue('');
    }
  };

  return [
    <>
      <FormField label="Add a comment" hideLabel>
        <Textarea
          ref={ref}
          autosize
          autoFocus
          value={value}
          placeholder="Write a comment"
          style={{ lineHeight: 1.2, minHeight: 32 }}
          onChange={event => setValue(event.target.value)}
          onKeyDown={onKeyDown}
        />
      </FormField>
      {typeof mention.query === 'string' && !mentions[mention.query]
        ? createPortal(
            <List
              css={css({
                position: 'fixed',
                width: '250px',
                borderBottomLeftRadius: 'small',
                borderBottomRightRadius: 'small',
                boxShadow: 1,
                fontSize: 3,
                zIndex: 3,
                bottom:
                  window.innerHeight - textareaBoundingRect.top + mention.top,
                left: textareaBoundingRect.left + mention.left,
                backgroundColor: 'dialog.background',
                border: '1px solid',
                borderColor: 'dialog.border',
              })}
            >
              {mention.query.length < 3 ? (
                <ListAction>Please type more than 3 characters</ListAction>
              ) : (
                users.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    css={`
                      display: block;
                      width: 100%;
                      background: transparent;
                      border: none;
                      padding: 0;
                    `}
                  >
                    <ListAction
                      css={
                        menuIndex === index
                          ? css({
                              color: 'list.hoverForeground',
                              backgroundColor: 'list.hoverBackground',
                            })
                          : null
                      }
                    >
                      <img
                        alt={item.username}
                        css={css({
                          borderRadius: 2,
                          marginRight: 2,
                        })}
                        width={24}
                        height={24}
                        src={item.avatarUrl}
                      />{' '}
                      {item.username}
                    </ListAction>
                  </button>
                ))
              )}
            </List>,
            document.querySelector('#root')
          )
        : null}
    </>,
    value,
    mentions,
  ];
};
