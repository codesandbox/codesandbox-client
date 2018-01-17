import React from 'react';
import Helmet from 'react-helmet';

export default ({
  title = 'CodeSandbox: Online Code Editor Tailored for Web Application Development',
  description = 'CodeSandbox is an online code editor with a focus on creating and sharing web application projects',
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
      {
        name: 'keywords',
        content:
          'react, codesandbox, editor, code, javascript, playground, sharing, spa, single, page, application, web, application, frontend, front, end',
      },
    ]}
  />
);
