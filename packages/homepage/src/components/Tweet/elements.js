import styled from 'styled-components';

export const TweetsWrapper = styled.a`
  display: block;
  text-decoration: none;
  position: relative;
  max-width: 520px;
  background: #242424;
  box-shadow: 0px 16px 16px rgba(4, 4, 4, 0.25);
  border-radius: 4px;
  margin-top: 5.5rem;
  left: -7rem;
  padding: 2.7rem 4.2rem;

  ${props =>
    props.right &&
    `
    left: auto;
    right: -6.7rem;
  `}
`;

export const Quote = styled.blockquote`
  font-family: Roboto;
  font-style: italic;
  font-weight: normal;
  font-size: 23px;
  line-height: 32px;

  color: #ffffff;
  margin: 0;
  margin-bottom: 2rem;
`;

export const Info = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin: 0;

  color: #999999;
`;

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin-right: 1rem;
`;

export const Author = styled.footer`
  display: flex;
  align-items: center;
`;
