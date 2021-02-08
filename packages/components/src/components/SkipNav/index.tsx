import React from 'react';
import * as Reach from '@reach/skip-nav';
import { createGlobalStyle } from 'styled-components';
import css from '@styled-system/css';

export const SkipNavStyles = createGlobalStyle(
  css({
    '[data-reach-skip-nav-link]': {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      width: 1,
      margin: '-1px',
      padding: 0,
      overflow: 'hidden',
      position: 'absolute',
    },

    '[data-reach-skip-nav-link]:focus': {
      position: 'fixed',
      top: 2,
      left: 2,
      padding: 2,
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderColor: 'grays.600',
      zIndex: 1,
      width: 'auto',
      height: 'auto',
      clip: 'auto',
    },
  })
);

const SkipNavLink = () => <Reach.SkipNavLink />;

const SkipNav = {
  Link: SkipNavLink,
  Content: Reach.SkipNavContent,
};

export { SkipNav };
