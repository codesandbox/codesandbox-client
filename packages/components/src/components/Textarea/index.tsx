import React, { useCallback } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import Rect from '@reach/rect';
import { Stack, Input, Text } from '../..';

export interface ITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  autosize?: boolean;
  value?: string;
  defaultValue?: string;
  ref?: any;
}

export const TextareaComponent: any = styled(Input).attrs({
  as: 'textarea',
})<HTMLTextAreaElement>(
  css({
    minHeight: 64,
    padding: 2,
    width: '100%',
    resize: 'none',
    lineHeight: 1.2,
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

export const Textarea: React.FC<ITextareaProps> = React.forwardRef(
  (
    {
      maxLength,
      defaultValue = '',
      value = '',
      onChange,
      onKeyPress,
      autosize,
      ...props
    },
    ref
  ) => {
    const [innerValue, setInnerValue] = React.useState<string>(defaultValue);

    /**
     * To support both contolled and uncontrolled components
     * We sync props.value with internalValue
     */
    React.useEffect(
      function syncValue() {
        setInnerValue(value || defaultValue);
      },
      [value, defaultValue]
    );

    const internalOnChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
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
      <Wrapper>
        {autosize ? (
          <Autosize value={innerValue} style={props.style}>
            {(height: number) => (
              <TextareaComponent
                value={innerValue}
                onChange={internalOnChange}
                maxLength={maxLength}
                ref={ref}
                {...props}
                style={{
                  ...(props.style || {}),
                  height,
                }}
              />
            )}
          </Autosize>
        ) : (
          <TextareaComponent
            value={innerValue}
            onChange={internalOnChange}
            maxLength={maxLength}
            ref={ref}
            {...props}
          />
        )}

        {maxLength ? (
          <Count limit={maxLength <= innerValue.length}>
            {innerValue.length}/{maxLength}
          </Count>
        ) : null}
      </Wrapper>
    );
  }
);

const Autosize = ({ value, style = {}, ...props }) => (
  <Rect>
    {({ rect, ref }) => (
      <>
        <span
          style={{
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: '1px',
            margin: '-1px',
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            // Do not use "1px" as we need to use pre-wrap to
            // deal with height resize related to not explicitly
            // using linebreak (ENTER) as well
            // width: "1px",

            // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
            whiteSpace: 'nowrap',
            wordWrap: 'normal',
          }}
        >
          <Text
            block
            ref={ref}
            size={3}
            style={{
              // match textarea styles
              whiteSpace: 'pre-wrap',
              lineHeight: 1.2,
              minHeight: 64,
              padding: 8,
              ...style,
            }}
          >
            {value + ' '}
          </Text>
        </span>
        {props.children(rect ? rect.height + 20 : 0)}
      </>
    )}
  </Rect>
);
