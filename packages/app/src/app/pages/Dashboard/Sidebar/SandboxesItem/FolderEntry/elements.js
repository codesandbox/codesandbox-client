import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import ChevronRight from 'react-icons/lib/md/chevron-right';

export const Container = styled(NavLink)`
  transition: 0.25s ease all;
  display: flex;
  align-items: center;
  height: 2rem;

  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;

  border-left: 2px solid transparent;
  padding-left: ${props => 1 + (props.depth || 0) * 0.75}rem;

  user-select: none;

  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.secondary.clearer(0.5)};
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const CreateDirectoryContainer = Container.withComponent('div');

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 3rem;
  font-size: 1.125rem;
`;

export const AnimatedChevron = styled(ChevronRight)`
  transition: 0.25s ease transform;
  transform: rotate(${props => (props.open ? 90 : 0)}deg);
  margin-right: 0.25rem;
`;
