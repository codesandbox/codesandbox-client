import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Stack, Input } from '../..';

interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  autosize?: boolean;
  ref?: any;
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
    // no transition because it breaks autoshrink :(
    // leaving this comment here to save time of the brave
    // soul who tries this again
    // transition: 'height 150ms',
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
  const [wordCount, setWordCount] = useState(0);
  const [value, setValue] = useState('');

  const updateValues = v => {
    if (maxLength) {
      const trimmedText = v.substring(0, maxLength);
      setValue(trimmedText);
      setWordCount(trimmedText.length);
    } else {
      setValue(v);
    }
  };

  useEffect(() => {
    if (props.value) {
      updateValues(props.value);
    }
    // eslint-disable-next-line
  }, []);

  const Wrapper = useCallback(
    ({ children }) =>
      maxLength ? <Stack direction="vertical">{children}</Stack> : children,
    [maxLength]
  );

  // eslint-disable-next-line consistent-return
  const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e);
    updateValues(e.target.value);
    if (autosize) resize(e.target as HTMLTextAreaElement);
  };

  const keyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyPress) onKeyPress(e);
    if (maxLength) {
      if (maxLength <= wordCount) {
        return false;
      }
    }

    return true;
  };

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
          onChange={update}
          onKeyPress={keyPress}
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
