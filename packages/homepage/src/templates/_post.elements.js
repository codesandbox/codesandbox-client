import styled, { css } from 'styled-components';

export const PostContainer = styled.div`
  ${() => css`
    color: ${props => props.theme.homepage.white};
    font-size: 17px;
    font-weight: 300;
    color: #c5c5c5;
    padding: 0;

    li {
      line-height: 1.75rem;
    }

    p {
      line-height: 1.75rem;
    }

    img {
      margin-top: 0 !important;
    }

    blockquote {
      border-radius: 6px;
      background-color: #2a2a2a90;
      color: #c5c5c5 !important;
      margin: 0;
      padding: 1.5rem 1.75rem;
      p {
        margin-bottom: 0;
      }
      margin-bottom: 1.5rem;
    }

    code {
      background-color: #2a2a2a90;
      border: 1px solid #373737;
      border-radius: 0.375rem;
      font-family: Native, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        Liberation Mono, Courier New, monospace;
      font-size: 0.9em;
      padding: 2px 0.25em;
    }

    video {
      margin-bottom: 2rem;
    }

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
      letter-spacing: -0.01em;
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

    p:has(img) {
      margin-top: 4rem;
      margin-bottom: 4rem;
    }

    img {
      display: block;
      margin: 2rem -2rem;
      height: auto;
      width: inherit;
      max-width: calc(100% + 4rem);
    }

    .gatsby-resp-image-link {
      margin: 2rem -2rem;
      height: auto;
      width: inherit;
      max-width: calc(100% + 4rem);
    }

    .gatsby-resp-image-wrapper a:hover {
      border-color: transparent;
    }

    figcaption {
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
    }

    a {
      color: #e3ff73;
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      transition: all 100ms ease-in 0s;
    }

    a:hover {
      border-bottom: 1px solid;
      border-color: #e3ff73;
    }

    font-weight: 400;

    .gatsby-highlight {
      background: #151515;
      border: 1px solid #242424;
      padding: 1rem;
      border-radius: 0.25rem;
      margin: 2rem 0 4rem 0;

      pre {
        margin-bottom: 0;
      }

      code {
        background-color: transparent;
        padding: 0;
        margin: 0;
        border: 0;
        font-size: 100%;
        height: auto !important;
        line-height: 20px;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .token.comment {
      color: #5c6370;
      font-style: italic;
    }
    .token.keyword {
      color: #c678dd;
    }
    .token.selector {
      color: #c678dd;
    }
    .token.changed {
      color: #c678dd;
    }
    .token.operator {
      color: #abb2bf;
    }
    .token.property {
      color: #abb2bf;
    }
    .token.constant {
      color: #d19a66;
    }
    .token.number {
      color: #d19a66;
    }
    .token.builtin {
      color: #d19a66;
    }
    .token.attr-name {
      color: #d19a66;
    }
    .token.char {
      color: #56b6c2;
    }
    .token.symbol {
      color: #56b6c2;
    }
    .token.variable {
      color: #e06c75;
    }
    .token.tag {
      color: #e06c75;
    }
    .token.deleted {
      color: #e06c75;
    }
    .token.string {
      color: #98c379;
    }
    .token.inserted {
      color: #98c379;
    }
    .token.punctuation {
      color: #5c6370;
    }
    .token.function {
      color: #61afef;
    }
    .token.class-name {
      color: #e5c07b;
    }
    .token.important,
    .token.bold {
      font-weight: bold;
    }
    .token.italic {
      font-style: italic;
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
