import styled, { css } from 'styled-components';

export const mainStyle = css`
  margin: auto;
  color: white;
  overflow: hidden;
  line-height: 1.5;

  font-weight: 500;
  font-size: 18px;

  color: #fff;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Poppins';
  }

  p,
  li {
    font-family: 'Open Sans';
  }

  img {
    display: block;
    margin: 20px auto;
  }
`;

export const Image = styled.img`
  display: block;
  margin: 20px auto;
`;
