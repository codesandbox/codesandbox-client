import styled, { css } from 'styled-components';

export const mainStyle = css`
  margin: auto;
  color: white;
  overflow: hidden;
  line-height: 1.7;

  font-weight: 500;
  font-size: 18px;

  color: rgba(255, 255, 255, 0.9);

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: white;
    font-weight: 800;
  }

  h1,
  h2,
  h3 {
    font-family: 'Poppins', sans-serif;
  }

  h2 {
    margin-top: 3rem;
    font-size: 28px;
  }

  h3 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
    font-size: 26px;
  }

  h4 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    font-size: 20px;
    font-weight: 600;
  }

  ul,
  ol {
    margin-bottom: 28px;
  }

  p {
    margin-bottom: 28px;
    word-break: break-word;
  }

  p,
  li {
    font-family: 'Open Sans', sans-serif;
    color: rgba(255, 255, 255, 0.8);
  }

  img {
    display: block;
    margin: 20px auto;
  }

  figcaption {
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
  }

  a {
    color: ${props => props.theme.shySecondary};
  }
`;

export const Image = styled.img`
  display: block;
  margin: 20px auto;
`;
