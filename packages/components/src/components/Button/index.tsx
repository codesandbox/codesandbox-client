import styled from 'styled-components';
import css from '@styled-system/css';
import deepmerge from 'deepmerge';
import { Element } from '../Element';

const variantStyles = {
  primary: {
    backgroundColor: 'button.background',
    color: 'button.foreground',
    ':hover': {
      // hoverBackground is polyfilled and uses a gradient
      // so we use background and not backgroundColor

      // background is not hooked to the system like backgroundColor
      // so we need to write the long syntax
      // TODO @sid: extend our system to make background work as well
      background: theme => theme.colors.button.hoverBackground,
    },
    ':focus': {
      // we use the same colors for hover and focus
      // but we add an active state to give
      background: theme => theme.colors.button.hoverBackground,
    },
    ':disabled:hover': {
      background: 'transparent', // override hover
      backgroundColor: 'button.background',
    },
  },
  secondary: {
    backgroundColor: 'secondaryButton.background',
    color: 'secondaryButton.foreground',
    // same technique as primary
    ':hover': {
      background: theme => theme.colors.secondaryButton.hoverBackground,
    },
    ':focus': {
      background: theme => theme.colors.secondaryButton.hoverBackground,
    },
    ':disabled:hover': {
      background: 'transparent', // override hover
      backgroundColor: 'secondaryButton.background',
    },
  },
  link: {
    backgroundColor: 'transparent',
    color: 'mutedForeground',
    // same technique as primary
    ':hover': {
      color: 'foreground',
    },
    ':focus': {
      color: 'foreground',
    },
  },
  danger: {
    backgroundColor: 'dangerButton.background',
    color: 'dangerButton.foreground',
    // same technique as primary
    ':hover': {
      background: theme => theme.colors.dangerButton.hoverBackground,
    },
    ':focus': {
      background: theme => theme.colors.dangerButton.hoverBackground,
    },
    ':disabled:hover': {
      background: 'transparent', // override hover
      backgroundColor: 'dangerButton.background',
    },
  },
};

export const Button = styled(Element).attrs({ as: 'button' })<{
  variant?: 'primary' | 'secondary' | 'link' | 'danger';
}>(({ variant = 'primary', ...props }) =>
  css(
    deepmerge(
      {
        display: 'inline-block',
        cursor: 'pointer',
        height: 6,
        width: '100%',
        fontSize: 2,
        border: 'none',
        borderRadius: 'small',
        transition: 'all ease-in',
        transitionDuration: theme => theme.speeds[1],
        ':hover': {
          // totally custom button shadow, static across themes
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        ':focus': {
          outline: 'none',
          // totally custom button shadow, static across themes
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
        },
        ':active': {
          transform: 'scale(0.98)',
        },
        ':disabled': {
          opacity: '0.4',
          cursor: 'not-allowed',
        },
      },
      variantStyles[variant]
    )
  )
);
