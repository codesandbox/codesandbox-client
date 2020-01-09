import React, { useCallback } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import VisuallyHidden from '@reach/visually-hidden';
import { uniqueId } from 'lodash-es';
import { Text } from '../Text';
import { Element } from '../Element';

// Svg used for the icon
const svg = () =>
  `"data:image/svg+xml,%3Csvg width='8' height='24' viewBox='0 0 8 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.00006 17L1 13L7 13L4.00006 17Z' fill='currentColor'/%3E%3Cpath d='M3.99994 7L7 11H1L3.99994 7Z' fill='currentColor'/%3E%3C/svg%3E%0A"`;

export const SelectComponent = styled.select<{ icon?: boolean }>(props =>
  css({
    width: '100%',
    height: 6,
    paddingX: 2,
    paddingLeft: props.icon ? 6 : 2,
    fontSize: 3,
    borderRadius: 'small',
    backgroundColor: 'input.background',
    border: '1px solid',
    borderColor: 'input.border',
    color: 'input.placeholderForeground',
    appearance: 'none',
    backgroundImage: `url(${svg})`,
    backgroundPosition: 'calc(100% - 8px) center',
    backgroundRepeat: 'no-repeat',

    ':hover': {
      backgroundImage: `url(${svg})`,
      color: 'input.foreground',
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

interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: any;
}

export const Select: React.FC<ISelectProps> = ({
  label,
  children,
  icon,
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

  const id = props.id || uniqueId('form_');

  return (
    <>
      {props.placeholder && !label ? (
        <VisuallyHidden>
          <label htmlFor={id}>{props.placeholder}</label>
        </VisuallyHidden>
      ) : null}
      <Text
        as="label"
        size={2}
        marginBottom={2}
        htmlFor={id}
        style={{ display: 'block' }}
      >
        {label}
      </Text>
      <Wrapper>
        {icon ? <IconWrapper>{icon()}</IconWrapper> : null}
        <SelectComponent icon={Boolean(icon)} id={id} {...props}>
          {props.placeholder ? (
            <option value="" disabled selected>
              {props.placeholder}
            </option>
          ) : null}
          {children}
        </SelectComponent>
      </Wrapper>
    </>
  );
};
