import css from '@styled-system/css';
import deepmerge from 'deepmerge';
import React, {
  ComponentType,
  FunctionComponent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';
import styled from 'styled-components';

import { Element, Input } from '../..';

const variants = {
  default: {
    carets: fill => `
      <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7L7 11H1L4 7Z" fill="${fill}" />
        
        <path d="M4 17L1 13L7 13L4 17Z" fill="${fill}" />
      </svg>
    `,
    styles: {
      // inherits from input
    },
  },
  link: {
    carets: fill => `
      <svg width="8" height="24" viewBox="0 0 8 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 15L1 11L7 11L4 15Z" fill="${fill}" />
      </svg>
    `,
    styles: {
      border: 'none',
      backgroundColor: 'transparent',
    },
  },
};

const getSVG = (variant: keyof typeof variants, color: string) => {
  const fill = `#${(color || '').split('#')[1]}`;

  // caret icon
  const svgString = variants[variant].carets(fill);
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
};

const SelectComponent = styled(Input).attrs({ as: 'select' })<{
  variant: keyof typeof variants;
}>(({ variant }) =>
  css(
    deepmerge(variants[variant].styles, {
      appearance: 'none',
      color: 'input.placeholderForeground',
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
  variant: keyof typeof variants;
}>(({ variant }) =>
  css({
    position: 'relative',
    color: 'input.placeholderForeground',
    transition: 'all ease',
    transitionDuration: theme => theme.speeds[2],

    select: {
      paddingLeft: 7,
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

type Props = InputHTMLAttributes<HTMLInputElement> &
  SelectHTMLAttributes<HTMLSelectElement> & {
    Icon?: ComponentType;
    placeholder?: string;
    variant?: keyof typeof variants;
  };
export const Select: FunctionComponent<Props> = ({
  children,
  Icon,
  placeholder = null,
  variant = 'default',
  ...props
}) => {
  if (Icon)
    return (
      <SelectWithIcon variant={variant}>
        <Icon />

        <SelectComponent {...props} variant={variant}>
          {placeholder ? <option value="">{placeholder}</option> : null}

          {children}
        </SelectComponent>
      </SelectWithIcon>
    );

  return (
    <SelectComponent {...props} variant={variant}>
      {placeholder ? <option value="">{placeholder}</option> : null}

      {children}
    </SelectComponent>
  );
};
