import React from 'react';
import Helmet from 'react-helmet';

export default ({
  title = 'CodeSandbox: Online Code Editor Tailored for Web Application Development',
  description = 'CodeSandbox is an online code editor with a focus on creating and sharing web application projects',
  image = 'https://codesandbox.io/static/img/banner.png',
}: {
  title: string,
  description: string,
}) => (
  <Helmet
    title={title}
    meta={[
      { name: 'og:title', content: title },
      { name: 'description', content: description },
      { name: 'og:description', content: description },
      { name: 'twitter:description', content: description },
      { name: 'og:image', content: image },
      { name: 'twitter:image:src', content: image },
      {
        name: 'keywords',
        content:
          'react, codesandbox, editor, code, javascript, playground, sharing, spa, single, page, application, web, application, frontend, front, end',
      },

      { name: 'referrer', content: 'origin' },
      { property: 'og:type', content: 'website' },
      { property: 'og:author', content: 'https://codesandbox.io' },
      { name: 'theme-color', content: '#6CAEDD' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:site', content: '@codesandbox' },
      { property: 'twitter:creator', content: '@codesandbox' },
      { property: 'twitter:image:width', content: '1200' },
      { property: 'twitter:image:height', content: '630' },
    ]}
  />
);
