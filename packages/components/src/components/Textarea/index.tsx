import css from '@styled-system/css';
import React, {
  ChangeEvent,
  FunctionComponent,
  TextareaHTMLAttributes,
  useState,
} from 'react';
import styled from 'styled-components';

import { Input, Stack } from '../..';

const noop = () => undefined;

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

type ContainerProps = {
  maxLength?: number;
};
const Container: FunctionComponent<ContainerProps> = ({
  children,
  maxLength,
}) =>
  maxLength ? (
    <Stack css={{ width: '100%' }} direction="vertical">
      {children}
    </Stack>
  ) : (
    <>{children}</>
  );

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  autosize?: boolean;
  value?: string;
};
export const Textarea: FunctionComponent<Props> = ({
  autosize = false,
  onChange = noop,
  maxLength,
  ...props
}) => {
  const [value, setValue] = useState(props.value || '');

  const internalOnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event);
    setValue(event.target.value);

    if (autosize) {
      resize(event.target);
    }
  };

  const resize = (element: HTMLTextAreaElement) => {
    const offset = 2; // for borders on both sides
    element.style.height = ''; // reset before setting again
    element.style.height = `${element.scrollHeight + offset}px`;
  };

  return (
    <Container maxLength={maxLength}>
      <TextareaComponent
        value={value}
        onChange={internalOnChange}
        maxLength={maxLength}
        {...props}
      />

      {maxLength ? (
        <Count limit={maxLength <= value.length}>
          {`${value.length}/${maxLength}`}
        </Count>
      ) : null}
    </Container>
  );
};
