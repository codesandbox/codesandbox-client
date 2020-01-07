import React from 'react';
import { storiesOf } from '@storybook/react';

import Example from '.';

const stories = storiesOf('components/Example', module);

stories.add('Basic Example', () => <Example />);
