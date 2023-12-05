import React from 'react';
import deepmerge from 'deepmerge';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Input } from '../Input';
import { Element } from '../Element';

const variantStyles = {
  default: {
    // inherits from input
  },
  link: {
    border: 'none',
    backgroundColor: 'transparent',
  },
};

const variantCarets = {
  default: fill => `
    <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7L7 11H1L4 7Z" fill="${fill}" />
      <path d="M4 17L1 13L7 13L4 17Z" fill="${fill}" />
    </svg>
  `,
  link: fill => `
    <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 15L1 11L7 11L4 15Z" fill="${fill}" />
    </svg>
  `,
};
// <path d="M4 14L1 10H7L4 14Z" fill="${fill}" />

const getSVG = (variant, color) => {
  const fill = '#' + (color || '').split('#')[1];

  // caret icon
  const svgString = variantCarets[variant](fill);

  const header = 'data:image/svg+xml,';
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return header + encoded;
};

const SelectComponent = styled(Input).attrs(() => ({ as: 'select' }))<{
  variant?: string;
}>(({ variant = 'default' }) =>
  css(
    deepmerge(variantStyles[variant], {
      appearance: 'none',
      color: 'input.placeholderForeground',
      cursor: 'pointer',
      transition: 'all ease',
      transitionDuration: theme => theme.speeds[2],

      paddingRight: 5, // select has a caret icon on the right

      backgroundImage: theme =>
        theme &&
        `url(${getSVG(variant, theme.colors.input.placeholderForeground)})`,
      backgroundPosition: 'calc(100% - 8px) center',
      backgroundRepeat: 'no-repeat',

      ':hover, :focus': {
        color: 'input.foreground',
        backgroundImage: theme =>
          theme && `url(${getSVG(variant, theme.colors.input.foreground)})`,
      },
    })
  )
);

const SelectWithIcon = styled(Element)<{
  variant?: string;
}>(({ variant = 'default' }) =>
  css({
    position: 'relative',
    color: 'input.placeholderForeground',
    transition: 'all ease',
    transitionDuration: theme => theme.speeds[2],

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
        backgroundImage: theme =>
          `url(${getSVG(variant, theme.colors.input.foreground)})`,
      },
    },
  })
);

type SelectProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    icon?: any;
    placeholder?: string;
    variant?: 'default' | 'link';
  };

export const Select = ({
  icon = null,
  placeholder = null,
  ...props
}: SelectProps) => {
  const PrefixIcon = icon;

  if (icon)
    return (
      <SelectWithIcon variant={props.variant}>
        <PrefixIcon />
        <SelectComponent {...props}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {props.children}
        </SelectComponent>
      </SelectWithIcon>
    );

  return (
    <SelectComponent {...props}>
      {placeholder ? <option value="">{placeholder}</option> : null}
      {props.children}
    </SelectComponent>
  );
};
