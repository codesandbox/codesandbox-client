import React from 'react';
import { storiesOf } from '@storybook/react';
import Preference from './';
import { KEYBINDINGS } from '../../utils/keybindings';

const stories = storiesOf('components/Preference', module);
const keyBindingKeys = Object.keys(KEYBINDINGS);

stories
  .add('Boolean Perference', () => <Preference type="boolean" />)
  .add('String Perference', () => <Preference type="string" value="Test" />)
  .add('Keybinding Perference', () =>
    keyBindingKeys.map((id, i) => (
      <Preference
        key={id}
        title={KEYBINDINGS[id].title}
        value={KEYBINDINGS[id].bindings}
        type="keybinding"
      />
    ))
  )
  .add('Dropdown Perference', () => (
    <Preference type="dropdown" options={['one', 'two']} />
  ));
