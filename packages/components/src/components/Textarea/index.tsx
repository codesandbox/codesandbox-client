import React, { useCallback } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import Rect from '@reach/rect';
import VisuallyHidden from '@reach/visually-hidden';
import { Stack, Input, Text } from '../..';

interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  autosize?: boolean;
  value?: string;
  defaultValue?: string;
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
  defaultValue = '',
  value = '',
  onChange,
  onKeyPress,
  autosize,
  ...props
}) => {
  const [innerValue, setInnerValue] = React.useState<string>(defaultValue);

  /**
   * To support both contolled and uncontrolled components
   * We sync props.value with internalValue
   */
  React.useEffect(
    function syncValue() {
      setInnerValue(value);
    },
    [value]
  );

  const internalOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) onChange(event);
    setInnerValue(event.target.value);
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

  return (
    <>
      <Wrapper>
        <Autosize value={innerValue}>
          {(height: number) => (
            <TextareaComponent
              value={innerValue}
              onChange={internalOnChange}
              maxLength={maxLength}
              style={{ height }}
              {...props}
            />
          )}
        </Autosize>

        {maxLength ? (
          <Count limit={maxLength <= innerValue.length}>
            {innerValue.length}/{maxLength}
          </Count>
        ) : null}
      </Wrapper>
    </>
  );
};

const Autosize = ({ value, ...props }) => (
  <Rect>
    {({ rect, ref }) => (
      <>
        <VisuallyHidden>
          <Text
            block
            ref={ref}
            size={3}
            style={{
              // match textarea styles
              whiteSpace: 'pre',
              lineHeight: 1,
              minHeight: 64,
              padding: 8,
            }}
          >
            {value + ' '}
          </Text>
        </VisuallyHidden>
        {props.children(rect ? rect.height + 8 : 0)}
      </>
    )}
  </Rect>
);
