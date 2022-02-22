import styled from 'styled-components';

export const Title = styled.h1`
  font-size: 85px;
  letter-spacing: -0.025em;
  line-height: 1.09;
  font-family: ${props => props.theme.homepage.appleFont};
  font-family: 'TWKEverett', sans-serif;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  font-weight: normal;
  padding-right: 10%;

  ${props => props.theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 1.2;
    padding-right: 0;
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
