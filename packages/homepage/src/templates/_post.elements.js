import styled, { css } from 'styled-components';

export const PostContainer = styled.div`
  ${({ theme }) => css`
    color: ${props => props.theme.homepage.white};
    font-size: 1.1rem;
    line-height: 1.6rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.75);
    padding: 0;

    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${props => props.theme.homepage.white};
      line-height: 1.2;
      font-weight: 700;
    }

    h2 {
      margin: 4rem 0 2rem 0;
      font-size: 2rem;
      letter-spacing: -1px;
    }

    h3 {
      margin: 4rem 0 0.5rem 0;
      font-size: 23px;
    }

    h4 {
      margin: 3rem 0 0.5rem 0;
      font-size: 19px;
      font-weight: 600;
    }

    ul,
    ol {
      margin-bottom: 2rem;
    }

    p {
      margin-bottom: 2rem;

      strong {
        color: #fff;
      }
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
      color: ${theme.shySecondary};
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      transition: all 100ms ease-in 0s;
    }

    a:hover {
      border-bottom: 1px solid;
      border-color: ${theme.shySecondary};
    }

    font-weight: 400;
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      font-weight: 300;
    }
  `};
`;

export const Article = styled.article`
  display: block;
  padding: 1rem 0rem;
`;

export const Header = styled.section`
  text-align: center;
  padding: 4rem 0 2.5em 0;
  color: rgb(242, 242, 242);
  margin-bottom: 2rem;

  > a {
    text-decoration: none;
    color: #757575;
    font-size: 1rem;
    line-height: 4rem;
    border-bottom: 1px solid transparent;
    transition: all 100ms ease-in;
  }

  > a:hover {
    color: #fff;
    border-bottom: 1px solid #fff;
  }
`;

export const PostTitle = styled.h1`
  font-size: 2rem;
  line-height: 3rem;
  letter-spacing: -0.02rem;

  @media screen and (min-width: 768px) {
    font-size: 3rem;
    font-weight: 700;
    line-height: 5rem;
  }

  @media screen and (min-width: 960px) {
    font-size: 5rem;
    font-weight: 700;
    line-height: 6.2rem;
    padding: 2rem 1em;
  }
`;

export const Image = styled.img`
  width: 100%;
  max-width: 960px;

  display: block;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.5);
  border: 1px solid #242424;
  overflow: hidden;
  border-radius: 0.5rem;
  clip-path: inset(0px round 0.5rem);
  margin: 0 auto;
`;

export const MetaData = styled.aside`
  align-items: center;
`;

export const AuthorContainer = styled.div`
  text-align: left;
  height: 2.75rem;
  width: 12rem;
  margin: 2rem auto;

  > h4 {
    line-height: 22px;
    margin: 0;
  }

  > date {
    color: #757575;
    font-size: 1rem;
    line-height: 22px;
  }

  > img {
    width: 2.75rem;
    height: 2.75rem;
    float: left;
    margin-right: 1rem;
  }
`;
