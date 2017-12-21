import React from 'react';

import { storiesOf } from '@storybook/react';

import Preview from '../src/components/Preview';

const stories = storiesOf('Preview', module);

stories.add('with one file', () => (
  <Preview
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
  <Preview
    files={{
      '/index.js': {
        code: `
            import Hello from './Hello.js';

            document.body.innerHTML = JSON.stringify(Hello);
          `,
      },
      '/Hello.js': {
        code: `export default "Hello from another file!"`,
      },
    }}
    dependencies={{
      uuid: 'latest',
    }}
  />
));
