import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import MarginBase from '@codesandbox/common/lib/components/spacing/Margin';
import styled, { css } from 'styled-components';

export const Container = styled(Fullscreen)`
  color: white;

  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: linear-gradient(-180deg, #282d2f 0%, #1d1f20 100%);
`;

export const Content = styled(Fullscreen)`
  ${({ theme }) => css`
    border-top: 1px solid ${theme.background3};
    flex: 0 0 70px;
  `};
`;

export const Margin = styled(MarginBase)`
  min-height: 60vh;
`;
