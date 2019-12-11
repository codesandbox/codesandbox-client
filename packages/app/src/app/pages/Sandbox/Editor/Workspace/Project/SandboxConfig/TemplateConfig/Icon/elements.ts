import { Popover, PopoverDisclosure } from 'reakit/Popover';
import styled, { css } from 'styled-components';

import { PropertyValue } from '../../../elements';

export const Button = styled(PopoverDisclosure)<{ color: string }>`
  ${({ color }) => css`
    padding: 0;
    border: 0;
    background: transparent;
    color: ${color};

    cursor: pointer;
  `};
`;

export const IconWrapper = styled(Popover)`
  ${({ theme }) => css`
    padding: 10px;
    background: ${theme['sideBar.background']};
    border: 1px solid
      ${theme['sideBar.foreground'] ||
        (theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)')};
    box-shadow: 0 0 14px
      ${theme.light ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};

    svg {
      .stroke {
        fill: ${theme['sideBar.foreground'] ||
          (theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)')}};
      }

      .fill {
        fill: ${theme['sideBar.background']};
      }
    }
  `};
`;

export const List = styled.ul`
  list-style: none;
  display: grid;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(7, 24px);
  grid-gap: 10px;

  li {
    cursor: pointer;
  }
`;

export const Value = styled(PropertyValue)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const IconButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;

  cursor: pointer;
`;
