import React from 'react';
import deepmerge from 'deepmerge';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import VisuallyHidden from '@reach/visually-hidden';
import { Element, IElementProps } from '../Element';

const variantStyles = {
  primary: {
    backgroundColor: 'button.background',
    color: 'button.foreground',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      // hoverBackground is polyfilled and uses a gradient
      // so we use background and not backgroundColor

      // background is not hooked to the system like backgroundColor
      // so we need to write the long syntax
      // TODO @sid: extend our system to make background work as well
      background: theme => theme.colors.button.hoverBackground,
    },
  },
  secondary: {
    backgroundColor: '#ffffff1a',
    color: '#F2F2F2',

    ':hover:not(:disabled)': {
      background: '#333333',
    },
  },
  link: {
    backgroundColor: 'transparent',
    color: '#dbdbdb',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      color: 'foreground',
      backgroundColor: '#E5E5E51A',
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#dbdbdb',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      color: 'foreground',
      backgroundColor: '#FFFFFF1A',
    },
  },
  danger: {
    backgroundColor: 'dangerButton.background',
    color: 'dangerButton.foreground',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      background: theme => theme.colors.dangerButton.hoverBackground,
    },
  },
  light: {
    backgroundColor: '#FFFFFF',
    color: '#0E0E0E',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      backgroundColor: '#E0E0E0', // three up in the gray scale (gray[400])
    },
  },
  dark: {
    backgroundColor: '#0E0E0E',
    color: '#FFFFFF',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      backgroundColor: '#252525', // three down in the black scale (black[500])
    },
  },
  trial: {
    backgroundColor: '#644ED7',
    color: '#FFFFFF',

    ':hover:not(:disabled), :focus:not(:disabled)': {
      backgroundColor: '#7B61FF',
    },
  },
};

const sizeStyles = {
  regular: {
    paddingY: '4px',
    paddingX: '8px',
    height: '28px', // match with inputs
    fontSize: '13px',
    fontWeight: 'medium',
    lineHeight: '16px', // trust the height
  },
  large: {
    height: 'auto',
    paddingY: '12px',
    paddingX: '16px',
    fontWeight: 500,
    fontSize: '16px',
    whiteSpace: 'nowrap',
  },
};

const commonStyles = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  flex: 'none', // as a flex child
  fontFamily: 'Inter, sans-serif',
  width: '100%',
  border: 'none',
  borderRadius: '4px',
  transition: 'background .3s, color .3s, box-shadow .3s',
  textDecoration: 'none',

  ':focus-visible': {
    boxShadow: `0 0 0 2px #AC9CFF`,
    outline: 'none',
  },
  ':active:not(:disabled)': {
    transform: 'scale(0.98)',
  },
  ':disabled': {
    opacity: '0.4',
    cursor: 'not-allowed',
  },
  '&[data-loading="true"]': {
    opacity: 1,
    cursor: 'default',
  },
  '&[data-auto-width="true"]': {
    width: 'fit-content',
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    IElementProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'danger'
    | 'light'
    | 'dark'
    | 'trial';
  size?: 'regular' | 'large';
  loading?: boolean;
  href?: string;
  rel?: string; // Only use when using href and as="a"
  to?: string;
  as?: any;
  target?: any;
  autoWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'regular',
      loading,
      css = {},
      autoWidth,
      as: pAs,
      ...props
    },
    ref
  ) {
    const styles = deepmerge.all([
      variantStyles[variant],
      sizeStyles[size],
      commonStyles,
      css,
    ]);
    const usedAs = pAs || (props.to ? Link : 'button');
    // default type is button unless props.as was changed
    const type = usedAs === 'button' && 'button';

    return (
      <Element
        as={usedAs}
        type={type}
        css={styles}
        ref={ref}
        disabled={props.disabled || loading}
        data-loading={loading}
        data-auto-width={autoWidth}
        {...props}
      >
        {loading ? <AnimatingDots /> : props.children}
      </Element>
    );
  }
);

/** Animation dots, we use the styled.span syntax
 *  because keyframes aren't supported in the object syntax
 */
const transition = keyframes({
  '0%': { opacity: 0.6 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.6 },
});

const Dot = styled.span`
  font-size: 18px;
  animation: ${transition} 1.5s ease-out infinite;
`;

export const AnimatingDots = () => (
  <>
    <VisuallyHidden>Loading</VisuallyHidden>
    <span role="presentation">
      <Dot>·</Dot>
      <Dot style={{ animationDelay: '200ms' }}>·</Dot>
      <Dot style={{ animationDelay: '400ms' }}>·</Dot>
    </span>
  </>
);
