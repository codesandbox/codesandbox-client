import React from 'react';
import { storiesOf } from '@storybook/react';
import { noop } from '../../test/mocks';
import Preference from './';
import { KEYBINDINGS } from '../../utils/keybindings';

const stories = storiesOf('components/Preference', module);
const keyBindingKeys = Object.keys(KEYBINDINGS);

stories
  .add('Boolean Preference', () => (
    <Preference
      setValue={noop}
      value={false}
      title="Vim Mode?"
      type="boolean"
    />
  ))
  .add('String Preference', () => (
    <Preference
      setValue={noop}
      title="Whats your name?"
      type="string"
      value="Test"
    />
  ))
  .add('Keybinding Preference', () =>
    keyBindingKeys.map((id, i) => (
      <Preference
        setValue={noop}
        key={id}
        title={KEYBINDINGS[id].title}
        value={KEYBINDINGS[id].bindings}
        type="keybinding"
      />
    ))
  )
  .add('Dropdown Preference', () => (
    <Preference
      title="Select your editor"
      setValue={noop}
      type="dropdown"
      value="one"
      options={['one', 'two']}
    />
  ));
