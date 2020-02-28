import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { Textarea, FormField, Element } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

export const AddComment = () => {
  const [value, setValue] = useState('');
  const { actions, state } = useOvermind();

  const onSubmit = e => {
    e.preventDefault();
    actions.editor.addComment({
      comment: value,
      sandboxId: state.editor.currentSandbox.id,
      username: state.user.username,
    });
    setValue('');
  };

  // Form elements submit on Enter, except Textarea :)
  const submitOnEnter = event => {
    if (event.keyCode === ENTER && !event.shiftKey) onSubmit(event);
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
      <form onSubmit={onSubmit}>
        <FormField label="Add a comment" hideLabel>
          <Textarea
            autosize
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={submitOnEnter}
            placeholder="Write a comment"
            css={css({ minHeight: 8 })}
          />
        </FormField>
      </form>
    </Element>
  );
};
