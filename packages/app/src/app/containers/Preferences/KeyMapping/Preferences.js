import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { KEYBINDINGS } from 'app/store/preferences/keybindings';

import { Container, PreferenceContainer, PaddedPreference } from '../styles';

const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 0.5rem 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: ${props => props.theme.red};
  font-weight: 500;
`;

class Preferences extends React.Component {
  state = { error: null };

  getUserBindings = () => {
    const keybindings = this.props.store.editor.preferences.settings
      .keybindings;

    return keybindings.reduce(
      (bindings, binding) =>
        Object.assign(bindings, {
          [binding.key]: binding.bindings,
        }),
      {}
    );
  };

  validateValue = (name, value) => {
    const existingBindings = this.getUserBindings();
    const keyBindingKeys = Object.keys(KEYBINDINGS).filter(k => k !== name);

    const bindings = keyBindingKeys.map(
      id => existingBindings[id] || KEYBINDINGS[id].bindings
    );

    const valB0 = [...value[0]].sort().join('');
    const valB1 = value[1] && [...value[1]].sort().join('');
    const alreadyExists = bindings.some(([b0, b1]) => {
      if (
        b0 &&
        [...b0]
          .sort()
          .join('')
          .startsWith(valB0)
      ) {
        return true;
      }
      if (
        valB1 &&
        b1 &&
        [...b1]
          .sort()
          .join('')
          .startsWith(valB1)
      ) {
        return true;
      }
      return false;
    });

    if (alreadyExists) {
      return 'Another keymap already contains this keystroke.';
    }
    return false;
  };

  bindValue = name => ({
    setValue: value => {
      const error = this.validateValue(name, value);

      if (error) {
        this.setState({ error });
      } else {
        this.props.signals.editor.preferences.keybindingChanged({
          name,
          value,
        });
      }
    },
  });

  render() {
    const keyBindingKeys = Object.keys(KEYBINDINGS);
    const existingBindings = this.getUserBindings();

    return (
      <Container>
        <PreferenceContainer>
          {keyBindingKeys.map((id, i) => [
            <PaddedPreference
              key={id}
              title={KEYBINDINGS[id].title}
              value={existingBindings[id] || KEYBINDINGS[id].bindings}
              type="keybinding"
              {...this.bindValue(id)}
            />,
            i !== keyBindingKeys.length - 1 && <Rule key={id + 'rule'} />,
          ])}
          <ErrorMessage>{this.state.error}</ErrorMessage>
        </PreferenceContainer>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(Preferences));
