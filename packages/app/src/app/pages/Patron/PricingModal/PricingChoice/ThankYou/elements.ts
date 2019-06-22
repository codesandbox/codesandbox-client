import styled, { css } from 'styled-components';
import delay from '@codesandbox/common/lib/utils/animation/delay-effect';

export const Title = styled.div`
  ${({ color }) => css`
    font-size: 2rem;
    font-weight: 300;
    text-align: center;
    color: ${color};
    transition: 0.3s ease all;
    ${delay(0)};
  `}
`;

export const SubTitle = styled.div`
  margin: 1rem;
  margin-bottom: 0rem;
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.6;
  text-align: center;
  ${delay(0.1)};
`;
