import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { Element, FormField, Textarea } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, { useState } from 'react';

export const AddComment: React.FC = () => {
  const [value, setValue] = useState('');
  const { actions } = useOvermind();

  const onSubmit = e => {
    e.preventDefault();
    if (value) {
      actions.comments.addComment({
        content: value,
      });
      setValue('');
    }
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
        zIndex: 2,
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        boxShadow: theme => `0px -32px 32px ${theme.colors.dialog.background}`,
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
