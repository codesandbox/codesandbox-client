import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Element,
  FormField,
  Textarea,
  List,
  ListAction,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import React, { useState, useRef } from 'react';
import { useMention } from './hooks/useMention';

type Props = {
  onSubmit: (value: string) => void;
};

export const AddComment: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const textArea = useRef(null);
  const [filteredUsers, onKeyDown, onKeyUp, loadingUsers, mention] = useMention(
    {
      ref: textArea,
      value,
      setValue,
    }
  );

  const submit = event => {
    event.preventDefault();
    if (value) {
      onSubmit(value);
      setValue('');
    }
  };

  console.log({
    filteredUsers,
  });

  // Form elements submit on Enter, except Textarea :)
  const submitOnEnter = event => {
    onKeyDown(event);
    if (event.keyCode === ENTER && !event.shiftKey) {
      event.preventDefault();
      submit(event);
    }
  };

  return (
    <Element
      paddingX={2}
      paddingY={4}
      css={css({
        zIndex: 2,
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        boxShadow: theme => `0px -32px 32px ${theme.colors.dialog.background}`,
      })}
    >
      <form onSubmit={submit}>
        <FormField label="Add a comment" hideLabel>
          <Textarea
            ref={textArea}
            autosize
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={submitOnEnter}
            onKeyUp={onKeyUp}
            placeholder="Write a comment"
            style={{ lineHeight: 1.2, minHeight: 32 }}
          />
        </FormField>
        {mention ? (
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
            })}
          >
            {filteredUsers.map((item, index) => (
              <ListAction
                key={item.id}
                // isActive={highlightedIndex === index}
              >
                <img
                  alt={item.username}
                  css={css({
                    borderRadius: 2,
                    marginRight: 2,
                  })}
                  width={24}
                  height={24}
                  src={item.avatar_url}
                />{' '}
                {item.username}
              </ListAction>
            ))}
          </List>
        ) : null}
      </form>
    </Element>
  );
};
