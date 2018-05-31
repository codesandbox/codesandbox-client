import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Container = styled(NavLink)`
  transition: 0.3s ease border-color;
  display: flex;
  align-items: center;
  height: 2rem;

  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;

  border-left: 2px solid transparent;
  padding-left: ${props => 1.5 + (props.depth || 0) * 0.5}rem;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 1.75rem;
  font-size: 1.125rem;
`;
