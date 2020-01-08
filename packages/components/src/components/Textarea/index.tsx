import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import css from '@styled-system/css';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useCallback,
  useState,
} from 'react';
import styled, {
  StyledComponent,
  StyledComponentInnerOtherProps,
} from 'styled-components';

import { InputComponent } from '../Input';
import { Stack } from '../Stack';
import { Text } from '../Text';

const TextareaComponent = styled(InputComponent).attrs({
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

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  autosize?: boolean;
  label?: string;
};
export const Textarea: FunctionComponent<Props> = ({
  autosize,
  label,
  maxLength,
  onChange,
  onKeyPress,
  placeholder,
  ...props
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [value, setValue] = useState('');
  const id = useId(props.id);

  const Wrapper = useCallback(
    ({ children }) =>
      maxLength ? <Stack direction="vertical">{children}</Stack> : children,
    [maxLength]
  );

  // eslint-disable-next-line consistent-return
  const update = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(event);
    }

    if (maxLength) {
      const trimmedText = event.target.value.substring(0, maxLength);
      setValue(trimmedText);
      setWordCount(trimmedText.length);
    } else {
      setValue(event.target.value);
    }

    if (autosize) {
      resize(event.target as HTMLTextAreaElement);
    }
  };

  const keyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyPress) {
      onKeyPress(event);
    }

    return !(maxLength && maxLength <= wordCount);
  };

  const resize = (element: HTMLTextAreaElement) => {
    const offset = 2; // for borders on both sides
    element.style.height = ''; // reset before setting again
    element.style.height = element.scrollHeight + offset + 'px';
  };

  return (
    <>
      {placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{placeholder}</label>
        </VisuallyHidden>
      ) : null}

      {label ? (
        <Text
          as="label"
          htmlFor={id}
          marginBottom={2}
          size={2}
          style={{ display: 'block' }}
        >
          {label}
        </Text>
      ) : null}

      <Wrapper>
        <TextareaComponent
          id={id}
          onChange={update}
          onKeyPress={keyPress}
          value={value}
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
