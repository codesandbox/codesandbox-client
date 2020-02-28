import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { Input, Element } from '@codesandbox/components';
import { css } from '@styled-system/css';

export const AddComment = () => {
  const [value, setValue] = useState('');
  const { actions, state } = useOvermind();

  const addComment = e => {
    e.preventDefault();
    actions.editor.addComment({
      comment: value,
      sandboxId: state.editor.currentSandbox.id,
      username: state.user.username,
    });
    setValue('');
  };

  return (
    <Element
      paddingX={2}
      paddingY={4}
      css={css({
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
      })}
    >
      <form onSubmit={addComment}>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Write a comment"
        />
      </form>
    </Element>
  );
};
