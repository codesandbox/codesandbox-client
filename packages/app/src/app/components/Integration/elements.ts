import { Stack, Text } from '@codesandbox/components';
import styled, { css } from 'styled-components';

export const Container = styled.div<{
  small: boolean;
  loading: boolean;
}>`
  ${({ small, loading, theme }) => css`
    display: inline-flex;
    width: 100%;
    border-radius: 4px;
    color: ${theme.light ? css`#636363` : css`rgba(255, 255, 255, 0.8)`};
    overflow: hidden;

    ${small &&
    css`
      flex-direction: column;
      font-size: 0.875rem;
    `};

    ${loading &&
    css`
      opacity: 0.5;
    `};
  `}
`;

export const IntegrationBlock = styled(Stack)`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #000000;
  color: white;
`;

export const Name = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.01em;
  color: #ffffff;
`;
