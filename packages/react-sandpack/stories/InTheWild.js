import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object } from '@storybook/addon-knobs/react';

import SandpackProvider from '../src/components/SandpackProvider/index.ts';
import BrowserPreview from '../src/components/BrowserPreview/index.ts';

setAddon(JSXAddon);

const stories = storiesOf('InTheWild', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('with one file', () => (
  <SandpackProvider
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
  >
    <BrowserPreview />
  </SandpackProvider>
));
