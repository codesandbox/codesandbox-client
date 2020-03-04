import styled from 'styled-components';
import css from '@styled-system/css';
import deepmerge from 'deepmerge';
import { Element } from '../Element';

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
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link' | 'danger';
}

export const Button = styled(Element).attrs({ as: 'button' })<ButtonProps>(
  ({ variant = 'primary', ...props }) =>
    css(
      deepmerge(
        // @ts-ignore deepmerge allows functions as values
        // it overrides instead of merging, which is what we want
        // but it's types don't like it. so we're going to ignore that
        // TODO: raise a pull request for deepmerge or pick a different
        // library to deep merge objects
        variantStyles[variant],
        // static styles:
        {
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 'none', // as a flex child
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          paddingY: 0,
          paddingX: 2,
          height: '26px', // match with inputs
          width: '100%',
          fontSize: 2,
          fontWeight: 'medium',
          lineHeight: 1, // trust the height
          border: 'none',
          borderRadius: 'small',
          transition: 'all ease-in',
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
          ...props.css,
        }
      )
    )
);

Button.defaultProps = {
  type: 'button',
};
