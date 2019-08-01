import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ContributorsBadge from './';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/ContributorsBadge', module).addDecorator(
  ThemeDecorator
);
stories.add('Default', () => <ContributorsBadge username={'SaraVieira'} />);
