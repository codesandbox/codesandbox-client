import styled from 'styled-components';

export const H2 = styled.h2`
  font-size: 3rem;
  line-height: 57px;
  font-family: ${props => props.theme.homepage.appleFont};

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;

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
  font-size: 1.4375rem;
  `}

  ${props =>
    props.muted &&
    `
  color: ${props.theme.homepage.muted}
  `}

    ${props =>
      props.center &&
      `
text-align: center;
  `}
`;

export const H3 = styled.h3`
  font-weight: bold;
  font-size: 2rem;
  line-height: 39px;
  margin: 0;

  color: ${props => props.theme.homepage.white};
`;

export const H5 = styled.h5`
  font-family: ${props => props.theme.homepage.appleFont};
  font-weight: 500;
  font-size: 1.4375rem;
  line-height: 27px;
  margin: 0;

  color: ${props => props.theme.homepage.white};
`;
