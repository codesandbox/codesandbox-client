import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Input } from '../Input';
import { Element } from '../Element';

// caret icon
const svg = color =>
  `"data:image/svg+xml,%3Csvg width='8' height='24' viewBox='0 0 8 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.00006 17L1 13L7 13L4.00006 17Z' fill='%23${
    (color || '').split('#')[1]
  }'/%3E%3Cpath d='M3.99994 7L7 11H1L3.99994 7Z' fill='%23${
    (color || '').split('#')[1]
  }'/%3E%3C/svg%3E%0A"`;

const SelectComponent = styled(Input).attrs({ as: 'select' })(
  css({
    appearance: 'none',
    color: 'input.placeholderForeground',

    backgroundImage: theme =>
      theme && `url(${svg(theme.colors.input.placeholderForeground)})`,
    backgroundPosition: 'calc(100% - 8px) center',
    backgroundRepeat: 'no-repeat',

    ':hover, :focus': {
      color: 'input.foreground',
      backgroundImage: theme =>
        theme && `url(${svg(theme.colors.input.foreground)})`,
    },
  })
);

const SelectWithIcon = styled(Element)(
  css({
    position: 'relative',
    color: 'input.placeholderForeground',

    select: {
      paddingLeft: 6,
    },
    svg: {
      position: 'absolute',
      left: 2,
      top: '50%',
      transform: 'translateY(-50%)',
    },

    // hover anywhere on the component should make all elements change
    ':hover, :focus-within': {
      // the svg takes currentcolor
      color: 'input.foreground',
      select: {
        color: 'input.foreground',
        backgroundImage: theme => `url(${svg(theme.colors.input.foreground)})`,
      },
    },
  })
);

interface ISelectProps {
  icon?: any;
  placeholder?: string;
  children?: any;
}

export const Select = ({
  icon = null,
  placeholder = null,
  ...props
}: ISelectProps) => {
  const PrefixIcon = icon || React.Fragment;
  const SelectContainer = icon ? SelectWithIcon : React.Fragment;

  return (
    <>
      <SelectContainer>
        <PrefixIcon />
        <SelectComponent {...props}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {props.children}
        </SelectComponent>
      </SelectContainer>
    </>
  );
};
