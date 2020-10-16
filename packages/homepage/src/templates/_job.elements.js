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
  position: sticky;
  top: 70px;
  align-self: flex-start;

  @media screen and (max-width: 960px) {
    display: none;
  }
  p {
    font-size: 16px;
    line-height: 1.5;
  }
`;

export const MobileAside = styled(Aside)`
  display: none;
  width: 100%;
  position: initial;
  @media screen and (max-width: 960px) {
    display: block;
  }
`;

export const Grid = styled.div`
  grid-template-columns: 1fr 192px;
  grid-gap: 88px;
  display: grid;

  @media screen and (max-width: 960px) {
    order: -1;
    grid-template-columns: 1fr;
  }
`;
