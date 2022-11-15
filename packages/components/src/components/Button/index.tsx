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
    ':hover:not(:disabled)': {
      // hoverBackground is polyfilled and uses a gradient
      // so we use background and not backgroundColor

      // background is not hooked to the system like backgroundColor
      // so we need to write the long syntax
      // TODO @sid: extend our system to make background work as well
      background: theme => theme.colors.button.hoverBackground,
    },
    ':focus:not(:disabled)': {
      // we use the same colors for hover and focus
      // but we add an active state to give
      background: theme => theme.colors.button.hoverBackground,
    },
  },
  secondary: {
    backgroundColor: 'secondaryButton.background',
    color: 'secondaryButton.foreground',
    // same technique as primary
    ':hover:not(:disabled)': {
      background: theme => theme.colors.secondaryButton.hoverBackground,
    },
    ':focus:not(:disabled)': {
      background: theme => theme.colors.secondaryButton.hoverBackground,
    },
  },
  link: {
    backgroundColor: 'transparent',
    color: 'mutedForeground',
    // same technique as primary
    ':hover:not(:disabled)': {
      color: 'foreground',
    },
    ':focus:not(:disabled)': {
      color: 'foreground',
    },
  },
  danger: {
    backgroundColor: 'dangerButton.background',
    color: 'dangerButton.foreground',
    // same technique as primary
    ':hover:not(:disabled)': {
      background: theme => theme.colors.dangerButton.hoverBackground,
    },
    ':focus:not(:disabled)': {
      background: theme => theme.colors.dangerButton.hoverBackground,
    },
  },
  light: {
    backgroundColor: '#FFFFFF',
    color: '#0E0E0E',

    ':hover': {
      backgroundColor: '#E0E0E0', // three up in the gray scale (gray[400])
    },
  },
  dark: {
    backgroundColor: '#0E0E0E',
    color: '#FFFFFF',

    ':hover': {
      backgroundColor: '#252525', // three down in the black scale (black[500])
    },
  },
  trial: {
    backgroundColor: '#644ED7',
    color: '#FFFFFF',

    ':hover': {
      backgroundColor: '#7B61FF',
    },
  },
};

const commonStyles = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 'none', // as a flex child
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  paddingY: 0,
  width: '100%',
  paddingX: 2,
  height: '26px', // match with inputs
  fontSize: 2,
  fontWeight: 'medium',
  lineHeight: 1, // trust the height
  border: 'none',
  borderRadius: 'small',
  transition: 'all ease-in',
  textDecoration: 'none',
  transitionDuration: theme => theme.speeds[2],

  ':focus': {
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
    | 'link'
    | 'danger'
    | 'light'
    | 'dark'
    | 'trial';
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
    { variant = 'primary', loading, css = {}, autoWidth, as: pAs, ...props },
    ref
  ) {
    const styles = deepmerge.all([variantStyles[variant], commonStyles, css]);
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

const AnimatingDots = () => (
  <>
    <VisuallyHidden>Loading</VisuallyHidden>
    <span role="presentation">
      <Dot>·</Dot>
      <Dot style={{ animationDelay: '200ms' }}>·</Dot>
      <Dot style={{ animationDelay: '400ms' }}>·</Dot>
    </span>
  </>
);
