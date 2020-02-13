import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const Container = styled(NavLink)<{ active: boolean }>`
  ${({ active, theme }) => css`
    transition: 0.3s ease all;
    display: flex;
    width: 100%;
    height: 2.5rem;
    user-select: none;

    align-items: center;

    padding: 0 0.5rem;
    box-sizing: border-box;

    color: ${theme.placeholder};
    text-decoration: none;
    background-color: transparent;

    cursor: pointer;
    position: relative;

    &:hover {
      color: white;
    }

    ${active &&
      css`
        background-color: ${theme.secondary};
        color: white;
      `};
  `};
`;
