import React from 'react';
import { inject, observer } from 'mobx-react';

import { KEYBINDINGS } from 'common/utils/keybindings';
import {
  Title,
  SubDescription,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
} from '../elements';
import { Rule, ErrorMessage } from './elements';
import VSCodePlaceholder from '../VSCodePlaceholder';

class KeyMapping extends React.Component {
  state = { error: null };

  getUserBindings = () => {
    const keybindings = this.props.store.preferences.settings.keybindings;

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

    const valB0 = [...(value[0] || [])].sort().join('');
    const valB1 = value[1] && [...value[1]].sort().join('');
    const alreadyExists = bindings.some(([b0, b1]) => {
      const valb0 = b0 && [...b0].sort().join('');
      const valb1 = b1 && [...b1].sort().join('');

      if (
        (valb0 && valb0 === valB0 && valb1 && valb1 === valB1) ||
        (valb0 && valb0 === valB0 && !valb1 && !valB1)
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
        this.setState({ error: null });
        this.props.signals.preferences.keybindingChanged({
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
      <VSCodePlaceholder>
        <div>
          <Title
            css={`
              margin-bottom: 1px;
            `}
          >
            Key Bindings
          </Title>
          <SubDescription>
            Record CodeSandbox specific keybindings here. You can cancel a
            recording by pressing ESCAPE, you can confirm by pressing ENTER and
            you can delete a mapping by pressing BACKSPACE.
            <p>
              The second input can be specified for a <em>sequence</em> of
              actions, like double tapping shift.
            </p>
          </SubDescription>

          <SubContainer>
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
          </SubContainer>
        </div>
      </VSCodePlaceholder>
    );
  }
}

export default inject('signals', 'store')(observer(KeyMapping));
