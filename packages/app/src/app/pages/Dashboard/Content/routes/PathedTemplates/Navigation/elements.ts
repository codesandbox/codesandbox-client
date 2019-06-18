import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const NavigationLink = styled(Link)<{ first: boolean; last: boolean }>`
  ${({ first, last }) => css`
    margin-right: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: 0.3s ease color;

    &:hover {
      color: white;
    }

    &:last-child {
      margin-right: 0;
    }

    ${first
      ? css`
          margin-left: 0;
        `
      : css`
          margin-left: 0.5rem;
        `};

    ${last
      ? css`
          color: white;
        `
      : css`
          &::after {
            content: '›';
            margin-left: 0.5rem;
          }
        `};
  `}
`;
