import React from 'react';
import { storiesOf } from '@storybook/react';
import { object } from '@storybook/addon-knobs';
import CustomTemplate from '.';
import { sandbox } from '../SandboxCard/fixtures';

const template = (props = null) => ({
  id: '2321',
  color: '#fff',
  sandbox: sandbox(props),
});

const stories = storiesOf('components/CustomTemplate', module);
stories
  .add('Default', () => (
    <CustomTemplate template={object('template', template())} />
  ))
  .add('No Title', () => (
    <CustomTemplate template={object('template', template({ title: null }))} />
  ))
  .add('No Description', () => (
    <CustomTemplate
      template={object('template', template({ description: null }))}
    />
  ))
  .add('No Tags', () => (
    <CustomTemplate template={object('template', template({ tags: [] }))} />
  ));
