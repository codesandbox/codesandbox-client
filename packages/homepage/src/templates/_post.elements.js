import styled, { css } from 'styled-components';

export const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

export const Title = styled.h2`
  font-family: 'Poppins';
  font-weight: 600;
  font-size: 30px;
  line-height: 1.5;

  color: #f2f2f2;
`;

export const Date = styled.span`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 12px;
  color: #b8b9ba;
  display: block;
`;

export const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const Author = styled.h4`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 18px;
  margin: 0;
  margin-left: 16px;

  color: #f2f2f2;
`;

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
