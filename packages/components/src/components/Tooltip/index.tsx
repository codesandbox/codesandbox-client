import React from 'react';
import { Tooltip as ReachTooltip } from '@reach/tooltip';
import {
  createGlobalStyle,
  keyframes,
  css as styledcss,
} from 'styled-components';
import css from '@styled-system/css';
import '@reach/tooltip/styles.css';
import { Element } from '../..';

const transitions = {
  slide: keyframes({
    from: {
      opacity: 0,
      transform: 'translateY(-2px)',
    },
  }),
};

const TooltipStyles = createGlobalStyle(
  css({
    '[data-reach-tooltip][data-component=Tooltip]': {
      backgroundColor: 'grays.900',
      border: '1px solid',
      borderColor: 'grays.600',
      color: 'grays.100',
      borderRadius: 'medium',
      paddingX: 2,
      paddingY: 1,
      fontSize: 3,
      lineHeight: 1,
      zIndex: 3,

      // multiline
      maxWidth: 160,
      whiteSpace: 'normal',
      textAlign: 'center',

      // triangle
      ':after, :before': {
        bottom: '100%',
        left: '50%',
        border: 'solid transparent',
        content: " ' '",
        height: '0',
        width: '0',
        position: 'absolute',
        pointerEvents: 'none',
      },
      ':after': {
        borderColor: 'transparent',
        borderBottomColor: 'grays.900',
        borderWidth: '4px',
        marginLeft: '-4px',
      },
      ':before': {
        borderColor: 'transparent',
        borderBottomColor: 'grays.600',
        borderWidth: '6px',
        marginLeft: '-6px',
      },
    },
  }),
  styledcss`
    [data-reach-tooltip][data-component=Tooltip] {
      animation: ${transitions.slide} 150ms ease-out;
    }
  `
);

const Tooltip = props => (
  <>
    <TooltipStyles />
    <Element as={ReachTooltip} data-component="Tooltip" {...props} />
  </>
);

export { Tooltip };
