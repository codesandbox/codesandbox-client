import React from 'react';

import { storiesOf } from '@storybook/react';

import OpenInCodeSandbox from '../src/components/OpenInCodeSandbox';

const stories = storiesOf('Export To CodeSandbox', module);

stories.add('with multiple files', () => (
  <OpenInCodeSandbox
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
    dependencies={{
      uuid: 'latest',
    }}
  />
));
