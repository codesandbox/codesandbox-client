import * as React from 'react';
import { storiesOf } from '@storybook/react';
import CommunityBadge from './';

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
    <CommunityBadge
      sandboxesNumber={sandboxNumber}
      style={{
        width: 64,
        height: 50,
      }}
      template={template}
    />
  </div>
);

templates.map(t =>
  storiesOf('components/Community Badge/Gold', module).add(t, () => (
    <FrameworkBadge template={t} />
  ))
);

templates.map(t =>
  storiesOf('components/Community Badge/Silver', module).add(t, () => (
    <FrameworkBadge sandboxNumber={51} template={t} />
  ))
);
