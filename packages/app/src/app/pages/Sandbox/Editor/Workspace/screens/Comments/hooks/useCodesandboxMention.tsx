import { UserQuery } from '@codesandbox/common/lib/types';
import { ENTER, ESC } from '@codesandbox/common/lib/utils/keycodes';
import { FormField, List, ListAction, Textarea } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { convertMentionLinksToMentions } from 'app/overmind/utils/comments';
import React from 'react';

import { useMention } from './useMention';

export const useCodesandboxMention = ({
  initialValue,
  initialMentions,
  onSubmit,
  fixed,
}: {
  initialValue: string;
  initialMentions: {
    [mentionName: string]: any;
  };
  onSubmit: (
    value: string,
    mentions: { [username: string]: UserQuery }
  ) => void;
  fixed: boolean;
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

  // We have to use an effect to properly stop
  // propagation
  React.useEffect(() => {
    if (ref.current) {
      const onKeyDown = event => {
        if (event.keyCode === ESC) {
          event.stopPropagation();
        }
      };
      ref.current.addEventListener('keydown', onKeyDown);

      return () => {
        ref.current.removeEventListener('keydown', onKeyDown);
      };
    }

    return () => {};
    // eslint-disable-next-line
  }, [ref.current]);

  const onKeyDown = event => {
    if (mention.query !== null) {
      if (event.keyCode === ENTER) {
        event.preventDefault();
        if (users.length) {
          mention.add(users[menuIndex].username, users[menuIndex]);
        }
      } else if (event.keyCode === 38) {
        event.preventDefault();
        setMenuIndex(i => (i === 0 ? users.length - 1 : i - 1));
      } else if (event.keyCode === 40) {
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
      {typeof mention.query === 'string' && !mentions[mention.query] ? (
        <List
          css={css({
            position: fixed ? 'fixed' : 'absolute',
            width: '250px',
            borderBottomLeftRadius: 'small',
            borderBottomRightRadius: 'small',
            boxShadow: 1,
            fontSize: 3,
            zIndex: 3,
            bottom: fixed
              ? window.innerHeight - textareaBoundingRect.top + mention.top
              : textareaBoundingRect.height - mention.top + 40,
            left: fixed
              ? textareaBoundingRect.left + mention.left
              : mention.left,
            backgroundColor: 'dialog.background',
            border: '1px solid',
            borderColor: 'dialog.border',
          })}
        >
          {mention.query.length < 3 || !users.length ? (
            <ListAction>
              {mention.query.length < 3
                ? 'Please type more than 3 characters'
                : null}
            </ListAction>
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
        </List>
      ) : null}
    </>,
    value,
    mentions,
  ];
};
