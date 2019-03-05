// ./pages/_document.js
import React from 'react';
import Document, { Main, NextScript, Head } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const head = {
      description:
        'CodeSandbox is an online code editor with a focus on creating and sharing web application projects',
      image: 'https://codesandbox.io/static/img/banner.png',
    };
    return (
      <html lang="en">
        <Head>
          <meta name="og:title" content={head.title} />
          <meta name="og:description" content={head.description} />
          <meta name="twitter:description" content={head.description} />
          <meta name="description" content={head.description} />
          <meta name="og:image" content={head.image} />
          <meta name="twitter:image:src" content={head.image} />
          <meta
            name="keywords"
            content="react, codesandbox, editor, code, javascript, playground, sharing, spa, single, page, application, web, application, frontend, front, end"
          />
          <meta name="referrer" content="origin" />
          <meta name="theme-color" content="#6CAEDD" />
          <meta property="og:type" content="website" />
          <meta property="og:author" content="https://codesandbox.io" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="twitter:image:width" content="1200" />
          <meta property="twitter:image:height" content="630" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:site" content="@codesandbox" />
          <meta property="twitter:creator" content="@codesandbox" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700|Poppins:400,700"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
