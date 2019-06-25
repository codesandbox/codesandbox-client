import styled, { css } from 'styled-components';

import { Theme } from '../types';

export const IconContainer = styled.div`
  ${({ theme }: Theme) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    cursor: pointer;
    transition: 0.3s ease color;

    &:hover {
      color: white;
    }
  `}
`;

export const NoUsers = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.25rem;
`;

export const Users = styled.div`
  ${({ theme }: Theme) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    padding: 0 1rem 0.25rem;
  `}
`;
