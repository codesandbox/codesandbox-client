import PlusIcon from 'react-icons/lib/go/plus';
import styled, { css } from 'styled-components';

import Row from '../flex/Row';

export const Tabs = styled(Row)(
  ({ theme }) => css`
    background-color: ${theme.colors.grays[500]};
    font-size: ${theme.fontSizes[2]}px;
    box-shadow: ${theme.shadows.underline};
  `
);

export const Tab = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.white};
    padding: ${theme.space[3]}px 0;
    padding-left: ${theme.space[2]}px;
    cursor: pointer;

    &[aria-selected] {
      box-shadow: ${theme.shadows.active};
      & svg {
        opacity: 1;
      }
    }

    &:hover svg {
      opacity: 1;
    }
  `
);

/* close icon is a lie, it's just a rotated PlusIcon */
export const Close = styled(PlusIcon)(
  ({ theme }) => css`
    opacity: 0;
    fontsize: ${theme.fontSizes[1]}px;
    margin: ${theme.space[1]}px 0;
    transform: rotate(45deg);
  `
);
