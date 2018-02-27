import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object } from '@storybook/addon-knobs/react';

import Preview from '../src/components/Preview/index.ts';

setAddon(JSXAddon);

const stories = storiesOf('Preview', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('with one file', () => (
  <Preview
    files={{
      '/index.js': {
        code: text(
          'code',
          `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``
        ),
      },
    }}
    dependencies={object('dependencies', {
      uuid: 'latest',
    })}
  />
));

stories.addWithJSX('with multiple files', () => (
  <Preview
    files={{
      '/index.js': {
        code: text(
          '/index.js code',
          `import Hello from './Hello.js';

document.body.innerHTML = JSON.stringify(Hello);
`
        ),
      },
      '/Hello.js': {
        code: text(
          '/Hello.js code',
          `export default "Hello from another file!"`
        ),
      },
    }}
    dependencies={{}}
  />
));

stories.addWithJSX('with errors', () => (
  <Preview
    files={{
      '/index.js': {
        code: text(
          '/index.js code',
          `
throw new Error("I'm an error!");
          `
        ),
      },
    }}
    dependencies={{}}
  />
));
