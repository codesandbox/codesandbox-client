import React from 'react';
import { useTooltip, TooltipPopup, Position } from '@reach/tooltip';
import '@reach/tooltip/styles.css';
import Portal from '@reach/portal';
import {
  createGlobalStyle,
  keyframes,
  css as styledcss,
} from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../..';

/** Lots of dragons in this file
 *
 * There are portals, global styles, animations, css triangles
 *
 * Some of these dragons can be hidden in abstraction layers
 * of the system where they will sit tamed. These abstractions
 * will appear once when cover all components that can pop up
 * out of other components
 * (Menu, Tooltip, Dialog, Modal)
 *
 * Sidenote: the zIndexes in this component are merely suggestions,
 * we will need to tweak them according to our app
 *
 * Until we do, proceed with caution.
 */

/** Dragon number 1:
 * keyframes in styled-components do not work with
 * object styles. So we wrap them in css from styled-components
 * and then pass it to GlobalStyles as a second parameter
 */

const transitions = {
  slide: keyframes({
    from: {
      opacity: 0,
      transform: 'translateY(-2px)',
    },
  }),
};

const animation = styledcss`
  [data-reach-tooltip][data-component=Tooltip] {
    animation: ${transitions.slide} 100ms ease-out;
  }
  [data-component=TooltipTriangle] {
    animation: ${transitions.slide} 100ms ease-out;
  }
`;

/** Dragon number 2:
 * wait global styles?
 * Because tooltips are creating in a portal,
 * styles applied from our theme provider do not work
 * because they are outside that tree - portal
 * so we apply global styles with their [data-reach-name]
 */

export const TooltipStyles = createGlobalStyle(
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
      zIndex: 20, // TODO: we need to sort out our z indexes!

      // multiline
      maxWidth: 160,
      whiteSpace: 'normal',
      textAlign: 'center',
    },
  }),
  animation
);
interface TooltipProps {
  label: string | React.ReactElement | null;
  children: React.ReactElement;
}

/** Dragon number 3:
 * to attach a triangle and transitions to the tooltip,
 * we have to drop one abstraction level deeper and use
 * TooltipPopup and create the triangle in another component
 */

/**
 * Render a tooltip around the children, if you pass `null` to `label` the Tooltip
 * won't be rendered.
 */
const Tooltip: React.FC<TooltipProps> = props => {
  const [trigger, tooltip] = useTooltip();
  const { isVisible, triggerRect } = tooltip;

  if (props.label === null) {
    return props.children;
  }

  return (
    <>
      {React.cloneElement(props.children, trigger)}
      <TooltipPopup
        {...tooltip}
        data-component="Tooltip"
        label={props.label}
        position={centered}
      />
      {isVisible && <Triangle triggerRect={triggerRect} />}
    </>
  );
};

// center the tooltip with respect to the trigger
const centered: Position = (targetRect, popoverRect) => {
  if (!targetRect || !popoverRect) {
    return {};
  }

  const triggerCenter = targetRect.left + targetRect.width / 2;
  const left = triggerCenter - popoverRect.width / 2;
  const maxLeft = window.innerWidth - popoverRect.width - 2;
  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: targetRect.bottom + 8 + window.scrollY,
  };
};

/** Dragon number 4:
 * We use a span to create the first triangle and position
 * another triangle(:after) on top of it to get the border
 * Also, why is the triangle using a portal??
 * Using a Portal may seem a little extreme, but we can keep the
 * positioning logic simpler here instead of needing to consider
 * the popup's position relative to the trigger and collisions
 * Implementation taken from https://reacttraining.com/reach-ui/tooltip/
 */

const Triangle = ({ triggerRect }) => (
  <Portal>
    <Element
      as="span"
      data-component="TooltipTriangle"
      css={{
        position: 'absolute',
        left:
          triggerRect &&
          triggerRect.left - 10 + triggerRect.width / 2 + 3 + 'px',
        top: triggerRect && triggerRect.bottom + window.scrollY - 4 + 'px',
        width: 0,
        height: 0,
        border: '6px solid transparent',
        borderBottomColor: 'grays.600',
        zIndex: 4, // one higher than the tooltip itself
        ':after': {
          content: " ' '",
          border: '6px solid transparent',
          borderBottomColor: 'grays.900',
          height: 0,
          width: 0,
          position: 'absolute',
          left: '-6px',
          top: '-4px',
        },
      }}
    />
  </Portal>
);

export { Tooltip };
