import React from 'react';
import { storiesOf } from '@storybook/react';
import { PatronStar } from '.';

const stories = storiesOf('components/PatronStar', module);

stories
  .add('Basic PatronStar', () => <PatronStar />)
  .add('PatronStar with Date', () => (
    <PatronStar subscriptionSince={new Date()} />
  ));
