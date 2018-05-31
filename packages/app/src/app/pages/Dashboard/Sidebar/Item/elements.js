import styled, { keyframes, css } from 'styled-components';
import { NavLink } from 'react-router-dom';

const selectAnimation = keyframes`
  0% { background-position: 0% 0%  }
  100% { background-position: -100% 0%  }
`;

export const Container = styled(NavLink)`
  display: flex;
  width: 100%;
  height: 2.5rem;

  align-items: center;

  padding: 0 1rem;
  box-sizing: border-box;

  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;

  background-image: linear-gradient(
    to right,
    transparent 0%,
    transparent 50%,
    #6caedd 50%,
    #6caedd 100%
  );
  background-size: 200%;

  background-position: 0% 0%;

  &.active {
    animation: ${selectAnimation} 0.3s;

    animation-fill-mode: forwards;
    color: white;
  }
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
