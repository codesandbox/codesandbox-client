import styled from 'styled-components';
import css from '@styled-system/css';
import { Stack } from '../Stack';

/**
 * Honestly, I'm not sure if this component should
 * exist as a resuable component.
 *
 * I've found this exact combination of styles
 * handy multiple times in the sidebar based on
 * how we lay out elements inside a minimum "row"
 * of 32px even if the element is smaller.
 *
 */

export const SidebarRow = styled(Stack).attrs({
  align: 'center',
})(
  css({
    minHeight: 8,
  })
);
