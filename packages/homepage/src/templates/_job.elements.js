import { Button } from '@codesandbox/components';
import styled, { css } from 'styled-components';

export const Title = styled.h1`
  ${({ theme }) => css`
    font-weight: 900;
    font-size: 48px;
    margin-bottom: 2em;
    margin-top: 1em;
    padding-bottom: 0;
    color: ${theme.homepage.white};
  `};
`;

export const BackButton = styled.h1`
  ${({ theme }) => css`
    text-decoration: none;
    font-size: 23px;
    line-height: 27px;

    color: ${theme.homepage.muted};
  `};
`;

export const ContentBlock = styled.div`
  ${({ theme }) => css`
    h2 {
      font-weight: 900;
      font-size: 32px;
      line-height: 38px;
      margin-top: 36px;
      color: ${theme.homepage.white};
    }

    font-weight: 400;
    font-size: 23px;
    line-height: 27px;
    color: ${theme.homepage.white};
    margin-bottom: 36px;
  `};
`;

export const ApplyButton = styled(Button)`
  display: block;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  margin-top: 24px;
  background: #5962df;
  height: 32px;
`;

export const Aside = styled.aside`
  width: 192px;
  p {
    font-size: 16px;
    line-height: 1.5;
  }
`;

export const Grid = styled.div`
  ${({ theme }) => css`
    grid-template-columns: 1fr 192px;
    grid-gap: 88px;
    display: grid;

    ${theme.breakpoints.lg} {
      grid-template-columns: 1fr;
    }
  `};
`;
