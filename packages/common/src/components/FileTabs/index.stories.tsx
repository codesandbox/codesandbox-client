import React from 'react';
import { storiesOf } from '@storybook/react';
import { FileTabs } from './';

const stories = storiesOf('components/FileTabs', module);

stories.add('Basic', () => {
  // dummy API: WIP
  const files = [
    { id: 'f1', name: 'index.js', selected: true },
    { id: 'f2', name: 'app.js' },
    { id: 'f3', name: 'screen.css' },
  ];

  return <FileTabs files={files} />;
});
