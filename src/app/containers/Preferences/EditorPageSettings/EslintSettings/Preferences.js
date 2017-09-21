import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import preferencesActionCreators from 'app/store/preferences/actions';

import {
  Container,
  PreferenceContainer,
  PaddedPreference,
  Description,
  Rule
} from '../../styles';

type Props = {
  preferencesActions: typeof preferencesActionCreators,
  preferences: Object
};

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(preferencesActionCreators, dispatch)
});

const mapStateToProps = state => ({
  preferences: preferencesSelector(state)
});

const Preferences = ({ preferences, preferencesActions }: Props) => {
  const bindValue = name => ({
    value: preferences[name],
    setValue: value =>
      preferencesActions.setPreference({
        [name]: value
      })
  });
  return (
    <Container>
      <PreferenceContainer>
        <PaddedPreference
          title="Global Variables"
          type="string"
          placeholder="jquery, TweenMax"
          {...bindValue('eslintGlobalVars')}
        />
        <Description>Enter global variables with comma</Description>
        <Rule />
      </PreferenceContainer>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
