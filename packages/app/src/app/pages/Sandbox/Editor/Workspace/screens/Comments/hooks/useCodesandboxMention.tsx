import { UserQuery } from '@codesandbox/common/lib/types';
import { ENTER, ESC } from '@codesandbox/common/lib/utils/keycodes';
import { FormField, List, ListAction, Textarea } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { convertMentionLinksToMentions } from 'app/overmind/utils/comments';
import React, { Attributes } from 'react';

import { useMention } from './useMention';

export const useCodesandboxMention = ({
  initialValue,
  initialMentions,
  onSubmit,
  fixed,
  props = {},
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
  props: typeof Textarea extends React.FC<infer P>
    ? P & { css?: Attributes['css'] }
    : never;
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

  function renderResult() {
    if (mention.query.length < 3) {
      return <ListAction>Please type more than 3 characters</ListAction>;
    }

    if (state.comments.isQueryingUsers && !users.length) {
      return <ListAction>Searching...</ListAction>;
    }

    if (!state.comments.isQueryingUsers && !users.length) {
      return <ListAction>No results</ListAction>;
    }

    return users.map((item, index) => (
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
    ));
  }

  return [
    <div style={{ position: 'relative' }}>
      <FormField label="Add a comment" hideLabel>
        <Textarea
          {...props}
          ref={ref}
          value={value}
          placeholder="Add a comment..."
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
            backgroundColor: 'dialog.background',
            border: '1px solid',
            borderColor: 'dialog.border',
          })}
          style={{
            bottom: fixed
              ? window.innerHeight - textareaBoundingRect.top + mention.top - 8 // 8 = padding
              : textareaBoundingRect.height - mention.top + 5,
            left: fixed
              ? textareaBoundingRect.left + mention.left - 8 // 8 = padding
              : mention.left,
          }}
        >
          {renderResult()}
        </List>
      ) : null}
    </div>,
    value,
    mentions,
  ];
};
