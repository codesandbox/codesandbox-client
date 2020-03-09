import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import { Textarea, FormField, Element } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

export const AddComment: React.FC = () => {
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
        // super custom shadow, TODO: check if this works in other themes
        boxShadow:
          '0px -4px 8px rgba(21, 21, 21, 0.4), 0px -8px 8px rgba(21, 21, 21, 0.4)',
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
