import { Button as ButtonBase } from '@codesandbox/common/lib/components/Button';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.background};
    padding: 1rem;
    margin: 0;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  `};
`;

export const Heading = styled.h2`
  margin-top: 0;
`;

export const Explanation = styled.p`
  line-height: 1.3;
  margin-bottom: 2rem;
`;

export const Button = styled(ButtonBase)`
  margin-right: 0.5rem;
`;
