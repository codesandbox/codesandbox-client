import styled, { css } from 'styled-components';

import media from '../utils/media';

export const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

const cardCSS = css`
  ${({ theme }) => css`
    background-color: ${theme.background};
    padding: 1.5rem;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    margin-bottom: 1rem;
  `};
`;

export const Article = styled.div`
  flex: 3;

  padding-right: 1rem;

  ${media.phone`
    padding-right: 0;
  `};
`;

export const DocsContainer = styled.div`
  display: flex;

  ${media.phone`
    flex-direction: column;
  `};
`;

export const DocsNavigation = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const DocumentationContent = styled.div`
  ${({ theme }) => css`
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.8);
    font-feature-settings: normal;

    iframe {
      display: block;
      margin: auto;
      border: 0;
      outline: 0;
    }

    h2 {
      font-family: 'Poppins', sans-serif;
      margin: 1.5rem 0;
      font-weight: 400;
      color: white;

      &:first-child {
        margin-top: 0;
      }
    }

    h3 {
      font-weight: 400;
      font-size: 1.25rem;
      color: white;
      margin-top: 2rem;
    }

    section {
      ${cardCSS};
      overflow-x: auto;
    }

    iframe {
      margin-bottom: 1rem;
    }

    code {
      background-color: rgba(0, 0, 0, 0.3);
      padding: 0.2em 0.4em;
      font-size: 85%;
      margin: 0;
      border-radius: 3px;
    }

    code,
    pre {
      font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New,
        monospace;
    }

    *:last-child {
      margin-bottom: 0;
    }

    .anchor {
      fill: ${theme.secondary};
    }

    .gatsby-highlight {
      background-color: rgba(0, 0, 0, 0.3);
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 1rem;

      code {
        background-color: transparent;
        padding: 0;
        margin: 0;
        font-size: 100%;
        height: auto !important;
        line-height: 20px;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .token.attr-name {
      color: ${theme.secondary};
    }

    .token.tag {
      color: #ec5f67;
    }

    .token.string {
      color: #99c794;
    }

    .token.keyword {
      color: ${theme.secondary};
    }

    .token.boolean,
    .token.function {
      color: #fac863;
    }

    .token.property,
    .token.attribute {
      color: ${theme.secondary};
    }

    .token.comment,
    .token.block-comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: #626466;
    }
  `};
`;

export const Edit = styled.a`
  transition: 0.3s ease color;
  display: flex;
  align-items: center;
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;

  ${media.phone`
    display: none;
  `};

  svg {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.75);
    margin-right: 0.5rem;
  }

  &:hover {
    color: white;
  }
`;

export const Heading = styled.div`
  ${({ theme }) => css`
    ${cardCSS};
    position: relative;

    background-image: linear-gradient(
      -45deg,
      ${theme.secondary.darken(0.1)()} 0%,
      ${theme.secondary.darken(0.3)()} 100%
    );
    padding: 2rem 2rem;
    color: white;
  `};
`;

export const Title = styled.h1`
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 500;
`;

export const Description = styled.p`
  font-size: 1.125rem;
  font-weight: 400;

  margin-bottom: 0.25rem;
`;
