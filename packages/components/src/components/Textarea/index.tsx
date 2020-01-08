import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { uniqueId } from 'lodash-es';
import { Text } from '../Text';
import { Stack } from '../Stack';
import { InputComponent } from '../Input';

interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxLength?: number;
}

export const TextareaComponent: any = styled(InputComponent).attrs({
  as: 'textarea',
})(
  css({
    height: 64,
    width: '100%',
    resize: 'none',
  })
);

const Count = styled.div<{ limit: boolean }>(({ limit }) =>
  css({
    fontSize: 2,
    paddingTop: 1,
    color: limit ? 'errorForeground' : 'input.placeholderForeground',
    alignSelf: 'flex-end',
  })
);

export const Textarea: React.FC<ITextareaProps> = ({
  label,
  maxLength,
  ...props
}) => {
  const id = props.id || uniqueId('form_');
  const [wordCount, setWordCount] = useState(0);
  const [value, setValue] = useState('');

  const Wrapper = useCallback(
    ({ children }) =>
      maxLength ? <Stack direction="vertical">{children}</Stack> : children,
    [maxLength]
  );

  // eslint-disable-next-line consistent-return
  const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(e);
    if (maxLength) {
      const trimmedText = e.target.value.substring(0, maxLength);
      setValue(trimmedText);
      setWordCount(trimmedText.length);
    } else {
      setValue(e.target.value);
    }
  };

  const keyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (props.onKeyPress) props.onKeyPress(e);
    if (maxLength) {
      if (maxLength <= wordCount) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      {label ? (
        <Text
          as="label"
          size={2}
          marginBottom={2}
          htmlFor={id}
          style={{ display: 'block' }}
        >
          {label}
        </Text>
      ) : null}
      <Wrapper>
        <TextareaComponent
          value={value}
          onChange={update}
          onKeyPress={keyPress}
          id={id}
          {...props}
        />
        {maxLength ? (
          <Count limit={maxLength <= wordCount}>
            {wordCount}/{maxLength}
          </Count>
        ) : null}
      </Wrapper>
    </>
  );
};
