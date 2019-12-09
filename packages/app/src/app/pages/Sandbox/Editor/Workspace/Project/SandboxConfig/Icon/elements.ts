import styled from 'styled-components';
import { Popover, PopoverDisclosure, PopoverArrow } from 'reakit/Popover';
import { PropertyValue } from '../../elements';

export const Button = styled(PopoverDisclosure)<{ color: string }>`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.color};

  cursor: pointer;
`;

export const IconWrapper = styled(Popover)`
  padding: 10px;
  background: ${props => props.theme['sideBar.background']};
  border: 1px solid
    ${({ theme }) =>
      theme['sideBar.foreground'] ||
      (theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)')};
  box-shadow: 0 0 14px
    ${({ theme }) =>
      theme.light ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};

  svg {
    .stroke {
      fill: ${({ theme }) =>
        theme['sideBar.foreground'] ||
        (theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)')}};
    }

    .fill {
      fill: ${props => props.theme['sideBar.background']};
    }
  }
`;

export const Arrow = styled(PopoverArrow)``;

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
