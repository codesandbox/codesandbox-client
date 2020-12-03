import styled from 'styled-components';

export const H2 = styled.h2`
  line-height: 57px;
  font-weight: 900;
  font-size: 48px;
  font-family: ${props => props.theme.homepage.appleFont};

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
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.white};
  margin: 0;
  margin-bottom: 1rem;

  ${props =>
    props.small &&
    `
    font-size: 0.875rem;
  `}

  ${props =>
    props.big &&
    `
  font-size: 23px;
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
  font-weight: bold;
  font-size: 23px;
  line-height: 27px;
  margin: 0;

  color: ${props => props.theme.homepage.white};

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
