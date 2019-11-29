import styled, { css } from 'styled-components';
import { Link } from 'gatsby';

export const Title = styled.h1`
  ${({ theme }) => css`
    font-family: ${theme.homepage.appleFont};
    font-weight: 500;
    font-size: 2.5rem;
    line-height: 3rem;
    color: ${theme.homepage.white};
    margin: 0.5rem 0;

    ${theme.breakpoints.md} {
      font-size: 1.5rem;
      line-height: 1.2;
      max-width: 80%;
    }
  `};
`;

export const SeoText = styled.p`
  color: ${props => props.theme.homepage.muted};
  font-style: normal;
  font-weight: 500;
  font-size: 1.4375rem;
  line-height: 2rem;
`;

export const Border = styled.div`
  height: 1px;
  width: 100%;
  background: #242424;
  margin: 5rem 0;
`;

export const Investors = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.5rem;
  justify-content: center;
  margin-top: 4rem;

  > div {
    background: #151515;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2.45rem 3.125rem;

    img {
      max-width: 100%;
    }
  }
`;

export const AngelInvestors = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.5rem;
  justify-content: center;
  margin-top: 1.5rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: repeat(auto-fit, minmax(255px, 1fr));
  }

  > div {
    background: #151515;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: center;
    padding: 2.45rem 0;
    color: #b8b9ba;

    img {
      margin-bottom: 1.625rem;
    }

    b {
      padding-bottom: 0.5rem;
      font-size: 1.5rem;
      color: ${props => props.theme.homepage.white};
    }
  }
`;

export const HiringLink = styled(Link)`
  font-weight: 500;
  font-size: 32px;
  line-height: 37px;
  text-decoration: none;
  text-align: center;
  width: 100%;
  display: block;
  margin-top: 2.5rem;

  color: ${props => props.theme.homepage.white};
`;
