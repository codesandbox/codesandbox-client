import React from 'react';

import { storiesOf } from '@storybook/react';

import Playground from '../src/components/Playground';

const stories = storiesOf('Playground', module);

stories.add('with one file', () => (
  <Playground
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``,
      },
    }}
    dependencies={{
      uuid: 'latest',
    }}
  />
));

stories.add('with multiple files', () => (
  <Playground
    files={{
      '/index.js': {
        code: `import Hello from './Hello.js';

document.body.innerHTML = JSON.stringify(Hello);
`,
      },
      '/Hello.js': {
        code: `export default "Hello from another file!"`,
      },
    }}
    dependencies={{}}
  />
));

stories.add('with errors', () => (
  <Playground
    files={{
      '/index.js': {
        code: `
throw new Error("I'm an error!");
          `,
      },
    }}
    dependencies={{}}
  />
));
