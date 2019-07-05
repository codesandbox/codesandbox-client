import styled from 'styled-components';
import { PropertyValue } from '../../elements';
import { Popover, PopoverDisclosure } from 'reakit/Popover';

export const Button = styled(PopoverDisclosure)<{ color: string }>`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.color};
`;

export const IconWrapper = styled(Popover)`
  padding: 10px;
  background: white;
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
`;
