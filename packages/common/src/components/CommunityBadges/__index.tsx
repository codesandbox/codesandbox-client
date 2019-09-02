import 'jest-styled-components';
import React from 'react';
import mountWithTheme from '../../test/themeMount';
import CommunityBadge from '.';

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

describe('<Checkbox /> rendering', () => {
  templates.map(t =>
    it(`gold ${t}`, () => {
      expect(mountWithTheme(<FrameworkBadge template={t} />)).toMatchSnapshot();
    })
  );

  templates.map(t =>
    it(`silver ${t}`, () => {
      expect(
        mountWithTheme(<FrameworkBadge template={t} sandboxNumber={51} />)
      ).toMatchSnapshot();
    })
  );
});
