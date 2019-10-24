import styled, { css } from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';

export const Navigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 2rem;
`;

export const NavButton = styled(Button).attrs({
  small: true,
})`
  margin: 0 0.5rem;
`;

export const Notice = styled.div`
  padding: 2rem 0;
  padding-bottom: 0;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.5);
`;

export const ErrorTitle = styled.div`
  ${({ theme }) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    font-size: 1.25rem;
  `}
`;
