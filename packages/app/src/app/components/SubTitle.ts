import styled, { css } from 'styled-components';
import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';

export const SubTitle = styled.h2<{ delay?: number | null }>`
  ${({ delay = 0, theme }) => css`
    width: 100%;
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    font-size: 1.75rem;
    font-weight: 300;
    line-height: 1.4;
    text-align: center;
    ${delay !== null && delayEffect(delay)};
  `}
`;
