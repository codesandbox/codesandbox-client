import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Stack, Input } from '../..';

interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  autosize?: boolean;
  value?: string;
}

export const TextareaComponent: any = styled(Input).attrs({
  as: 'textarea',
})<HTMLTextAreaElement>(
  css({
    minHeight: 64,
    padding: 2,
    width: '100%',
    resize: 'none',
    // autosize styles
    overflow: 'hidden',
    transitionProperty: 'height',
    transitionDuration: theme => theme.speeds[2],
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
  maxLength,
  onChange,
  onKeyPress,
  autosize,
  ...props
}) => {
  const [value, setValue] = useState(props.value || '');

  const internalOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(event);
    setValue(event.target.value);
    if (autosize) resize(event.target);
  };

  const Wrapper = useCallback(
    ({ children }) =>
      maxLength ? (
        <Stack direction="vertical" css={{ width: '100%' }}>
          {children}
        </Stack>
      ) : (
        children
      ),
    [maxLength]
  );

  const resize = (element: HTMLTextAreaElement) => {
    const offset = 2; // for borders on both sides
    element.style.height = ''; // reset before setting again
    element.style.height = element.scrollHeight + offset + 'px';
  };

  return (
    <>
      <Wrapper>
        <TextareaComponent
          value={value}
          onChange={internalOnChange}
          maxLength={maxLength}
          {...props}
        />
        {maxLength ? (
          <Count limit={maxLength <= value.length}>
            {value.length}/{maxLength}
          </Count>
        ) : null}
      </Wrapper>
    </>
  );
};
