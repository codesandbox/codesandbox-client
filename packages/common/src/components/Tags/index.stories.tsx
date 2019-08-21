import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, array } from '@storybook/addon-knobs';
import Tags from '.';

storiesOf('components/Tags', module)
  .add('One tag', () => <Tags tags={array('tags', ['one'])} />)
  .add('Many tags', () => (
    <Tags tags={array('tags', ['one', 'two', 'three', 'four', 'five'])} />
  ))
  .add('Many tags', () => (
    <Tags
      tags={array('tags', ['one', 'two', 'three', 'four', 'five'])}
      align={select('align', ['right', 'left'], 'right')}
    />
  ));
