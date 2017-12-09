import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import preferencesActionCreators from 'app/store/preferences/actions';
import { KEYBINDINGS } from 'app/store/preferences/keybindings';

import { Container, PreferenceContainer, PaddedPreference } from '../styles';

type Props = {
  preferencesActions: typeof preferencesActionCreators,
  preferences: Object,
};

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

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(preferencesActionCreators, dispatch),
});
const mapStateToProps = state => ({
  preferences: preferencesSelector(state),
});

class Preferences extends React.Component<Props> {
  state = { error: null };

  validateValue = (name, value) => {
    const { preferences } = this.props;

    const existingBindings = preferences.keybindings || {};
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

  bindValue = name => {
    const { preferencesActions, preferences } = this.props;

    return {
      setValue: value => {
        const error = this.validateValue(name, value);

        if (error) {
          this.setState({ error });
        } else {
          preferencesActions.setPreference({
            keybindings: {
              ...preferences.keybindings,
              [name]: value,
            },
          });
        }
      },
    };
  };

  render() {
    const { preferences } = this.props;
    const keyBindingKeys = Object.keys(KEYBINDINGS);

    const existingBindings = preferences.keybindings || {};
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

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
