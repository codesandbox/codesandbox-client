import React from 'react';

const JS_NPM_URLS = [
  'https://unpkg.com/docsearch.js@2.4.1/dist/cdn/docsearch.min.js',
];

export default function HTML(props) {
  return (
    <html lang="en" {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        <link
          href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <style>
    svg {
      background: transparent;
    }
    path {
      fill: black;
    }
    @media (prefers-color-scheme: dark)  {
      path {
        fill: white;
      }
    }
  </style>
  <path fill-rule='evenodd' clip-rule='evenodd' d='M81.8182 18.1818V81.8182H18.1818V18.1818H81.8182ZM10 90V10H90V90H10Z'/>
</svg>"
          rel="icon"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key="body"
          id="___gatsby"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        {JS_NPM_URLS.map(url => (
          <script key={url} src={url} defer />
        ))}
      </body>
    </html>
  );
}
