import styled, { css } from 'styled-components';

export const DocumentationContent = styled.div`
  ${({ theme }) => css`
    line-height: 1.5;
    font-feature-settings: normal;
    font-size: 16px;

    * {
      box-sizing: border-box;
    }

    iframe {
      background: #151515;
      display: block;
      margin: 4rem auto;
      border: 0;
      outline: 0;
    }

    h2 {
      font-size: 24px;
      margin: 16px 0;
      display: block;
    }

    h3 {
      font-size: 20px;
      margin: 16px 0;
      display: block;
    }

    p {
      color: #999;
    }

    section {
      overflow-x: auto;
    }

    li {
      color: #999;
    }

    a {
      color: #0971f;
      text-decoration: none;
    }

    table {
      width: 100%;
      max-width: 100%;
      overflow: scroll;
      border: 1px solid #242424;
      border-radius: 0.5rem;
      margin: 2rem 0 4rem 0;
    }

    th,
    td,
    td {
      border-radius: 0.5rem;
      padding: 0.5rem;
      border-right: 1px solid #242424;
      border-bottom: 1px solid #242424;
      overflow: hidden;
    }

    td {
      color: #999;
    }

    table tr:last-child td:first-child {
      border-bottom-left-radius: 0.5rem;
    }

    table tr:last-child td:last-child {
      border-bottom-right-radius: 0.5rem;
    }

    code {
      background: #151515;
      padding: 0.25rem 0.5rem;
      font-size: 85%;
      margin: 0;
      border-radius: 0.25rem;
    }

    img.gatsby-resp-image-image {
      background: #242424;
      border: 1px solid #242424;
      border-radius: 4px;
    }

    code,
    pre {
      font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New,
        monospace;
    }

    .anchor {
      fill: ${theme.secondary};
    }

    .gatsby-highlight {
      background: #151515;
      border: 1px solid #242424;
      padding: 1rem;
      border-radius: 0.25rem;
      margin: 2rem 0 4rem 0;

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
