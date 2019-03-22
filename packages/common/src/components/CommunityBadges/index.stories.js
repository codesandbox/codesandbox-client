import React from 'react';
import { select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

import Badge from './index.tsx';

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

const FrameworkBadge = ({ template, sandboxNumber = 100 }) => (
  <div
    style={{
      width: 64,
      height: 50,
    }}
  >
    <Badge
      sandboxesNumber={sandboxNumber}
      style={{
        width: 64,
        height: 50,
      }}
      template={select('template', templates, template)}
    />
  </div>
);

templates.map(t =>
  storiesOf('Community Badge/Gold', module).add(t, () => (
    <FrameworkBadge template={t} />
  ))
);

templates.map(t =>
  storiesOf('Community Badge/Silver', module).add(t, () => (
    <FrameworkBadge sandboxNumber={51} template={t} />
  ))
);
