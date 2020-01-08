import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { uniqueId } from 'lodash-es';

const placeholderStyles = {
  color: 'input.placeholderForeground',
  fontSize: 13,
};

export const TextareaComponent = styled.textarea(
  css({
    height: 64,
    width: '100%',
    padding: 2,
    resize: 'none',
    backgroundColor: 'input.background',
    borderBottom: '1px solid',
    borderColor: 'input.border',
    color: 'input.foreground',
    borderRadius: 'small',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
  })
);

const Label = styled.label(
  css({
    fontSize: 11,
    paddingBottom: 2,
    color: 'sidebar.foreground',
    display: 'block',
  })
);

const MaxLengthWrapper = styled.div(
  css({
    display: 'flex',
    flexDirection: 'column',
  })
);

const Count = styled.div<{ limit: boolean }>(({ limit }) =>
  css({
    fontSize: 11,
    paddingTop: 1,
    color: limit ? 'errorForeground' : 'input.placeholderForeground',
    alignSelf: 'flex-end',
  })
);

interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invisibleLabel?: string;
  label?: string;
  maxLength?: number;
}

export const Textarea: React.FC<ITextareaProps> = ({
  invisibleLabel,
  label,
  maxLength,
  ...props
}) => {
  const id = props.id || uniqueId('form_');
  const [wordCount, setWordCount] = useState(0);
  const [value, setValue] = useState('');

  const Wrapper = useCallback(
    ({ children }) =>
      maxLength ? <MaxLengthWrapper>{children}</MaxLengthWrapper> : children,
    [maxLength]
  );

  // eslint-disable-next-line consistent-return
  const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) props.onChange(e);
    if (maxLength) {
      if (maxLength <= wordCount) {
        return false;
      }
      const trimmedText = e.target.value.substring(0, maxLength);
      setValue(trimmedText);
      setWordCount(trimmedText.length);
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <>
      {invisibleLabel ? (
        <VisuallyHidden>
          <label htmlFor={id}>{invisibleLabel}</label>
        </VisuallyHidden>
      ) : null}
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Wrapper>
        <TextareaComponent value={value} onChange={update} id={id} {...props} />
        {maxLength ? (
          <Count limit={maxLength <= wordCount}>
            {wordCount}/{maxLength}
          </Count>
        ) : null}
      </Wrapper>
    </>
  );
};
