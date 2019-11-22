import styled from 'styled-components';

export const TweetsWrapper = styled.a`
  display: block;
  text-decoration: none;
  position: absolute;
  max-width: 520px;
  background: ${props => props.theme.homepage.grey};
  box-shadow: 0px 1rem 1rem rgba(4, 4, 4, 0.25);
  border-radius: 4px;
  margin-top: 5.5rem;
  left: -6rem;
  padding: 2.7rem 4.2rem;

  ${props => props.theme.breakpoints.md} {
    position: relative;
    right: auto;
    left: auto;
    width: 90%;
    padding: 2rem;
  }

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
  font-size: 1.4375rem;
  line-height: 32px;

  color: ${props => props.theme.homepage.white};
  margin: 0;
  margin-bottom: 2rem;

  ${props => props.theme.breakpoints.md} {
    font-size: 1.2rem;
    line-height: 1.2;
  }
`;

export const Info = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 24px;
  margin: 0;

  color: ${props => props.theme.homepage.muted};
`;

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  margin-right: 1rem;

  ${props => props.theme.breakpoints.md} {
    display: none;
  }
`;

export const Author = styled.footer`
  display: flex;
  align-items: center;
`;
