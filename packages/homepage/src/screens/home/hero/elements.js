import styled from 'styled-components';

export const HeroWrapper = styled.div`
  padding: 7rem 0 5rem 0;
  margin-bottom: 4rem;

  ${props => props.theme.breakpoints.md} {
    padding-top: 5rem;
  }

  > div {
    text-align: center;
    max-width: 80%;
    width: 100%;
    margin: auto;
  }

  ${props => props.theme.breakpoints.md} {
    padding: 7rem 0 0rem 0;
    margin-bottom: 0rem;

    > div {
      max-width: 90%;
    }
  }
`;

export const Title = styled.h1`
  font-size: 64px;
  letter-spacing: -0.025em;
  line-height: 120%;
  font-family: ${props => props.theme.homepage.appleFont};
  font-family: 'TWKEverett', sans-serif;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  font-weight: normal;

  ${props => props.theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 1.2;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 2rem;
  }
`;

export const SubTitle = styled.h2`
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.muted};
  margin: 0;
  margin-bottom: 1rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;
