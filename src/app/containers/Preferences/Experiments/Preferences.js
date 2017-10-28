import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { preferencesSelector } from 'app/store/preferences/selectors';
import preferencesActionCreators from 'app/store/preferences/actions';

import {
  Container,
  PreferenceContainer,
  // PaddedPreference,
  Description,
} from '../styles';

type Props = {
  preferencesActions: typeof preferencesActionCreators,
  preferences: Object,
};

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(preferencesActionCreators, dispatch),
});
const mapStateToProps = state => ({
  preferences: preferencesSelector(state),
});
// eslint-disable-next-line no-unused-vars arrow-body-style
const Preferences = ({ preferences, preferencesActions }: Props) => {
  // const bindValue = name => ({
  //   value: preferences[name],
  //   setValue: value =>
  //     preferencesActions.setPreference({
  //       [name]: value,
  //     }),
  // });

  return (
    <Container>
      <PreferenceContainer>
        <Description>
          We have no experiments running currently! Tune in later to find some
          new goodies to test.
        </Description>
      </PreferenceContainer>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
