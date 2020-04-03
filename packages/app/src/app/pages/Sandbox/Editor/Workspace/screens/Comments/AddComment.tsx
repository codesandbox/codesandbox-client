import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { Element, FormField, Textarea } from '@codesandbox/components';
import { css } from '@styled-system/css';
import React, { useState } from 'react';

type Props = {
  onSubmit: (value: string) => void;
};

export const AddComment: React.FC<Props> = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  // Form elements submit on Enter, except Textarea :)
  const submitOnEnter = event => {
    if (event.keyCode === ENTER && !event.shiftKey && value) {
      event.preventDefault();
      onSubmit(value);
      setValue('');
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
      <form onSubmit={onSubmit}>
        <FormField label="Add a comment" hideLabel>
          <Textarea
            autosize
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={submitOnEnter}
            placeholder="Write a comment"
            style={{ lineHeight: 1.2, minHeight: 32 }}
          />
        </FormField>
      </form>
    </Element>
  );
};
