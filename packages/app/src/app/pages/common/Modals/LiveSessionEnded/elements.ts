import styled, { css } from 'styled-components';

import { Explanation as ExplanationBase } from '../elements';

export const Container = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.background};
    padding: 1rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
  `};
`;

export const Explanation = styled(ExplanationBase)`
  margin-bottom: 1rem;
`;
