import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
  `}
`;

export const Buttons = styled.div`
  display: flex;
  margin: 1rem 0.125rem;

  button {
    margin: 0 0.875rem;
  }
`;

export const ErrorMessage = styled.div`
  ${({ theme }) => css`
    color: ${theme.red};
    margin: 1rem;
    font-size: 0.875rem;
  `}
`;

export const NoChanges = styled.em`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;
