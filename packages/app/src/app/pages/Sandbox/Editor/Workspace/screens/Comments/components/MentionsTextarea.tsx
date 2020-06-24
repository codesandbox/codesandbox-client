import { UserQuery } from '@codesandbox/common/lib/types';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { FormField, List, ListAction, Textarea } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { useMention } from '../hooks/useMention';

type Props = {
  initialValue: string;
  onSubmit: (
    value: string,
    mentions: { [username: string]: UserQuery }
  ) => void;
};

export const MentionsTextArea: React.FC<Props> = ({
  initialValue,
  onSubmit,
}) => {
  const ref = React.useRef(null);
  const { state, actions } = useOvermind();
  // TODO: Allow passing in initial mentions
  const [value, setValue, mention, mentions] = useMention(ref, initialValue);
  const [menuIndex, setMenuIndex] = React.useState(0);
  const users = state.comments.usersQueryResult;

  React.useEffect(() => {
    actions.comments.queryUsers(mention.query);
  }, [mention.query, actions.comments]);

  React.useEffect(() => {
    if (menuIndex > users.length - 1) {
      setMenuIndex(users.length - 1);
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

  return (
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
            position: 'absolute',
            width: '100%',
            borderBottomLeftRadius: 'small',
            borderBottomRightRadius: 'small',
            boxShadow: 1,
            fontSize: 3,
            backgroundColor: 'dialog.background',
            border: '1px solid',
            borderColor: 'dialog.border',
            top: 0,
            transform: 'translateY(-102%)',
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
        </List>
      ) : null}
    </>
  );
};
