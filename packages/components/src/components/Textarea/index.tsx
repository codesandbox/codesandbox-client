import React, { useState, useCallback, useEffect } from 'react';
import styled, {
  StyledComponent,
  StyledComponentInnerOtherProps,
} from 'styled-components';
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
  autosize?: boolean;
}

export const TextareaComponent: any = styled(InputComponent).attrs({
  as: 'textarea',
})(
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
) as StyledComponent<
  'textarea',
  any,
  StyledComponentInnerOtherProps<typeof InputComponent>
>;

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
  onChange,
  onKeyPress,
  autosize,
  ...props
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [value, setValue] = useState('');
  const [id, setID] = useState('textarea_0');

  useEffect(() => {
    setID(uniqueId('textarea_'));
  }, []);

  const Wrapper = useCallback(
    ({ children }) =>
      maxLength ? <Stack direction="vertical">{children}</Stack> : children,
    [maxLength]
  );

  // eslint-disable-next-line consistent-return
  const update = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(e);
    if (maxLength) {
      const trimmedText = e.target.value.substring(0, maxLength);
      setValue(trimmedText);
      setWordCount(trimmedText.length);
    } else {
      setValue(e.target.value);
    }

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
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={props.id || id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      {label ? (
        <Text
          as="label"
          size={2}
          marginBottom={2}
          htmlFor={props.id || id}
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
          id={props.id || id}
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
