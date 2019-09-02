import 'jest-styled-components';
import React from 'react';
import { noop } from '../../test/mocks';
import mountWithTheme from '../../test/themeMount';
import Preference from './';
import { KEYBINDINGS } from '../../utils/keybindings';

const keyBindingKeys = Object.keys(KEYBINDINGS);

describe('<Preference /> rendering', () => {
  it('boolean', () => {
    const wrapper = mountWithTheme(
      <Preference
        setValue={noop}
        value={false}
        title="Vim Mode?"
        type="boolean"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('string', () => {
    const wrapper = mountWithTheme(
      <Preference
        setValue={noop}
        title="Whats your name?"
        type="string"
        value="Test"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('dropdown', () => {
    const wrapper = mountWithTheme(
      <Preference
        title="Select your editor"
        setValue={noop}
        type="dropdown"
        value="one"
        options={['one', 'two']}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
  keyBindingKeys.map((id, i) =>
    it('string', () => {
      const wrapper = mountWithTheme(
        <Preference
          setValue={noop}
          key={id}
          title={KEYBINDINGS[id].title}
          value={KEYBINDINGS[id].bindings}
          type="keybinding"
        />
      );
      expect(wrapper).toMatchSnapshot();
    })
  );
});
