import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import ChevronRight from 'react-icons/lib/md/chevron-right';

export const Container = styled(NavLink)`
  transition: 0.3s ease all;
  display: flex;
  width: 100%;
  height: 2.5rem;
  user-select: none;

  align-items: center;

  padding: 0 0.5rem;
  box-sizing: border-box;

  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  background-color: transparent;

  cursor: pointer;

  &:hover {
    color: white;
  }

  ${props =>
    props.active &&
    css`
      background-color: ${props.theme.secondary};
      color: white;
      font-weight: 600;
    `};
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 2rem;
  font-size: 1.25rem;
`;

export const ItemName = styled.div`
  font-size: 0.875rem;
`;

export const AnimatedChevron = styled(ChevronRight)`
  transition: 0.25s ease transform;
  transform: rotate(${props => (props.open ? 90 : 0)}deg);
  margin-right: 0.25rem;
  width: 1rem;
`;
