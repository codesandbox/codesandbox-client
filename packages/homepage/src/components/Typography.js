import styled from 'styled-components';

export const H2 = styled.h2`
  line-height: 100%;

  font-weight: normal;
  font-size: 48px;
  font-family: ${props => props.theme.homepage.appleFont};
  font-family: 'TWKEverett', sans-serif;
  letter-spacing: -0.025em;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 0.5rem;

  ${props => props.theme.breakpoints.md} {
    font-size: 1.8rem;
    line-height: 1.2;
  }
`;

export const P = styled.p`
  font-weight: normal;
  font-size: 18px;
  line-height: 160%;
  color: ${props => props.theme.homepage.white};
  margin: 0;
  margin-bottom: 1rem;

  ${props =>
    props.small &&
    `
    font-size: 16px;
  `}

  ${props =>
    props.big &&
    `
  font-size: 24px;
  font-weight: normal;
  `}

  ${props =>
    props.muted &&
    `
  color: ${props.theme.homepage.muted};
  `}

    ${props =>
    props.center &&
    `
text-align: center;
  `}

  ${props => props.big && 'font-size: 1.5rem'};
`;

export const H3 = styled.h3`
  font-family: 'TWKEverett', sans-serif;
  letter-spacing: -0.0125em;
  font-weight: normal;
  font-size: 24px;
  line-height: 120%;
  margin: 0;

  color: ${props => props.theme.homepage.white};

  ${props =>
    props.muted &&
    `
    color: #999;
  
  `}

  ${props => props.theme.breakpoints.sm} {
    font-size: 1.75rem;
  }
`;

export const H5 = styled.h5`
  font-family: ${props => props.theme.homepage.appleFont};
  font-weight: 500;
  font-size: 1.4375rem;
  line-height: 27px;
  margin: 0;

  color: ${props => props.theme.homepage.white};

  ${props => props.theme.breakpoints.sm} {
    font-size: 1.25rem;
  }
`;

export const H6 = styled.h6`
  font-family: ${props => props.theme.homepage.appleFont};
  font-weight: 500;
  font-size: 1rem;
  line-height: 19px;
  margin: 0;
  text-align: center;

  color: ${props => props.theme.homepage.white};

  ${props =>
    props.left &&
    `
    text-align: left;
  
  `}

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.85rem;
  }
`;

export const Description = styled.h3`
  font-weight: normal;
  font-size: 24px;
  line-height: 160%;

  text-align: center;
  color: ${props => props.theme.homepage.muted};
  max-width: 650px;
  margin: 0 auto;

  ${props =>
    props.left &&
    `
    text-align: left;
  
  `}

  ${props => props.theme.breakpoints.sm} {
    font-size: 18px;
  }
`;
