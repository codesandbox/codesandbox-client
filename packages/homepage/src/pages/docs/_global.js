import { createGlobalStyle, css } from "styled-components";

export const Global = createGlobalStyle`
  body {
    .algolia-autocomplete .ds-dropdown-menu {
      .algolia-docsearch-suggestion--category-header .algolia-docsearch-suggestion--category-header-lvl0 .algolia-docsearch-suggestion--highlight {
        box-shadow: none;
      }
      .algolia-docsearch-suggestion--content:before, .algolia-docsearch-suggestion--subcategory-column:before {
          background: #242424;
      }
      &:before {
        background: #151515;
        border-top: 1px solid #242424;
        border-right: 1px solid #242424;
      }
      div[class^=ds-dataset-] {
        background: #151515;
        border: 1px solid #242424;
        box-sizing: border-box;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.12), 0px 16px 32px rgba(0, 0, 0, 0.24);
        color: white;
        max-width: calc(100vw - 32px);
      }



      @media screen and (max-width: 768px) {
        .algolia-docsearch-suggestion--content {
          display: none;
        }
      }



      .algolia-docsearch-suggestion {
        background: #151515;
        color: white;
      }

      .algolia-docsearch-suggestion--category-header {
        border: none;
        color: white;
      }

      .algolia-docsearch-suggestion--title, .algolia-docsearch-suggestion--subcategory-column-text {
        color: #757575;
        font-weight: normal;

        .algolia-docsearch-suggestion--highlight {
          color: white;
          background: transparent;
          box-shadow: none;
        }
      }
    }
  }
`;

export const APIStyle = css`
  h2 {
    font-size: 16px;
    padding: 40px 0;
    box-shadow: 0px -1px 0px #242424;
    margin: 0;
    position: relative;
  }

  p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 23px;
    color: #999999;
  }
  iframe {
    display: block;
    margin: 4rem auto;
    border: 0;
    outline: 0;
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

  h3 {
    font-size: 20px;
    margin: 16px 0;
    display: block;
  }

  a {
    color: #0971f;
    text-decoration: none;
  }

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
`;

export const FAQStyle = css`
  h2 {
    font-size: 16px;
    padding: 40px 0;
    box-shadow: 0px -1px 0px #242424;
    margin: 0;
    user-select: none;
    cursor: pointer;
    position: relative;

    &.open:after {
      transform: rotate(-90deg);
    }

    &:after {
      content: "";
      height: 14px;
      width: 9px;
      background-image: url('data:image/svg+xml,%3Csvg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M6.67512e-07 7.00014L9 1.03507e-06L9 14L6.67512e-07 7.00014Z" fill="%23343434"/%3E%3C/svg%3E%0A');
      position: absolute;
      transition: transform 200ms ease;
      right: 0;

      @media screen and (max-width: 768px) {
        display: none;
      }
    }
  }

  code {
    background: #151515;
    padding: 0.2em 0.4em;
    font-size: 85%;
    margin: 0;
    border-radius: 3px;
  }

  section .show:last-child {
    padding-bottom: 40px;
  }

  img {
    border: 1px solid #242424;
    border-radius: 4px;
  }

  a {
    color: #0971f;
    text-decoration: none;
  }

  ul {
    max-height: 0;
    opacity: 0;
    transition: all 200ms ease;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 23px;
    color: #999999;
    margin-bottom: 0;

    &.show {
      max-height: 800px;
      opacity: 1;
      margin-bottom: 1.0875rem;
    }
  }
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 23px;
    color: #999999;
    max-height: 0;
    opacity: 0;
    transition: all 200ms ease;
    margin: 0;

    &.show {
      opacity: 1;
      max-height: 400px;
      margin-bottom: 1.0875rem;
    }
  }
`;
