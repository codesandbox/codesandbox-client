import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { storiesOf, setAddon } from '@storybook/react';

import OpenInCodeSandbox from '../src/components/OpenInCodeSandbox/index.ts';

setAddon(JSXAddon);

const stories = storiesOf('Export To CodeSandbox', module);

stories.addWithJSX('with multiple files', () => (
  <OpenInCodeSandbox
    files={{
      '/index.js': {
        code: `import Hello from './Hello.js';

document.body.innerHTML = JSON.stringify(Hello);
`,
      },
      '/Hello.js': {
        code: `export default \`Hello from another file, here's an ID: $\{require('uuid')()}!\``,
      },
    }}
    dependencies={{
      uuid: 'latest',
    }}
  />
));
