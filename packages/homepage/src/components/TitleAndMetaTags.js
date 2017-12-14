import React from 'react';
import Helmet from 'react-helmet';

export default ({
  title = 'CodeSandbox: Online Code Editor Tailored for Web Application Development',
}: {
  title: string,
}) => (
  <Helmet
    title={title}
    meta={[
      { name: 'og:title', content: title },
      {
        name: 'description',
        content:
          'CodeSandbox is an online code editor with a focus on creating and sharing web application projects',
      },
      {
        name: 'keywords',
        content:
          'react, codesandbox, editor, code, javascript, playground, sharing, spa, single, page, application, web, application, frontend, front, end',
      },
    ]}
  />
);
