import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import css from '@styled-system/css';
import React, {
  FunctionComponent,
  SelectHTMLAttributes,
  useCallback,
} from 'react';
import styled from 'styled-components';

import { Element } from '../Element';
import { Text } from '../Text';

// Svg used for the icon
const svg = color =>
  `"data:image/svg+xml,%3Csvg width='8' height='24' viewBox='0 0 8 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.00006 17L1 13L7 13L4.00006 17Z' fill='%23${
    color.split('#')[1]
  }'/%3E%3Cpath d='M3.99994 7L7 11H1L3.99994 7Z' fill='%23${
    color.split('#')[1]
  }'/%3E%3C/svg%3E%0A"`;

const SelectComponent = styled.select<{ icon?: boolean }>(({ icon }) =>
  css({
    width: '100%',
    height: 6,
    paddingX: 2,
    paddingLeft: icon ? 6 : 2,
    fontSize: 3,
    borderRadius: 'small',
    backgroundColor: 'input.background',
    border: '1px solid',
    borderColor: 'input.border',
    color: 'input.placeholderForeground',
    appearance: 'none',
    backgroundImage: `url(${svg(
      props.theme.colors.input.placeholderForeground
    )})`,
    backgroundPosition: 'calc(100% - 8px) center',
    backgroundRepeat: 'no-repeat',

    ':hover': {
      color: 'input.foreground',
      backgroundImage: `url(${svg(props.theme.colors.input.foreground)})`,
    },
  })
);

const IconWrapper = styled(Element)(
  css({
    position: 'absolute',
    left: 2,
    top: '50%',
    transform: 'translateY(-50%)',
  })
);

const WrapperWithIcon = styled(Element)(
  css({
    ':hover svg path': {
      fill: 'input.foreground',
    },
  })
);

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  icon?: any;
};
export const Select: FunctionComponent<Props> = ({
  children,
  icon,
  label,
  placeholder,
  ...props
}) => {
  const Wrapper = useCallback(
    p =>
      icon ? (
        <WrapperWithIcon style={{ position: 'relative' }}>
          {p.children}
        </WrapperWithIcon>
      ) : (
        p.children
      ),
    [icon]
  );
  const id = useId(props.id);

  return (
    <>
      {placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{placeholder}</label>
        </VisuallyHidden>
      ) : null}

      <Text
        as="label"
        htmlFor={id}
        marginBottom={2}
        size={2}
        style={{ display: 'block' }}
      >
        {label}
      </Text>

      <Wrapper>
        {icon ? <IconWrapper>{icon()}</IconWrapper> : null}

        <SelectComponent icon={Boolean(icon)} id={id} {...props}>
          {placeholder ? (
            <option value="" selected>
              {placeholder}
            </option>
          ) : null}

          {children}
        </SelectComponent>
      </Wrapper>
    </>
  );
};
