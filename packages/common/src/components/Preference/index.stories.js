import React from 'react';
import { text, boolean, select, array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Preference from './index.tsx';

const templates = [
  'create-react-app',
  'vue-cli',
  'preact-cli',
  'svelte',
  'create-react-app-typescript',
  'angular-cli',
  'parcel',
  'cxjs',
  '@dojo/cli-create-app',
  'gatsby',
  'nuxt',
  'next',
  'reason',
  'apollo',
  'sapper',
  'nest',
  'static',
  'styleguidist',
];

storiesOf('Preferences', module)
  .add('Text', () => (
    <div style={{ width: 300 }}>
      <Preference
        title="Template"
        type="string"
        value={text('default', 'Create React App')}
      />
    </div>
  ))
  .add('Boolean', () => (
    <div style={{ width: 300 }}>
      <Preference
        title="Open"
        type="boolean"
        value={boolean('default', true)}
      />
    </div>
  ))
  .add('Dropdown', () => (
    <div style={{ width: 300 }}>
      <Preference
        title="Template"
        type="dropdown"
        options={select('options', 'vue-cli', templates)}
      />
    </div>
  ))
  .add('Keybinding', () => (
    <div style={{ width: 500 }}>
      <Preference title="Open in A new Tab" type="keybinding" value={[]} />
    </div>
  ));
