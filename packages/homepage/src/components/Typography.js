import styled from 'styled-components';

export const H2 = styled.h2`
  font-size: 48px;
  line-height: 57px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';

  color: #ffffff;
  padding: 0;
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const P = styled.p`
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #ffffff;
  margin: 0;
  margin-bottom: 1rem;

  ${props =>
    props.muted &&
    `
  color: #999999
  `}
`;

export const H3 = styled.h3`
  font-weight: bold;
  font-size: 32px;
  line-height: 39px;
  margin: 0;

  color: #ffffff;
`;

export const H5 = styled.h5`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
  font-weight: 500;
  font-size: 23px;
  line-height: 27px;
  margin: 0;

  color: #ffffff;
`;
