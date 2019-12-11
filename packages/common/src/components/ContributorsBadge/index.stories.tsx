import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';
import ContributorsBadge from '.';

const stories = storiesOf('components/ContributorsBadge', module);
stories.add('Default', () => (
  <ContributorsBadge username={text('name', 'SaraVieira')} />
));
