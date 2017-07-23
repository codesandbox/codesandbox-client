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
  Rule,
} from '../../styles';

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

const Preferences = ({ preferences, preferencesActions }: Props) => {
  const bindValue = name => ({
    value: preferences[name],
    setValue: value =>
      preferencesActions.setPreference({
        [name]: value,
      }),
  });
  return (
    <Container>
      <PreferenceContainer>
        <PaddedPreference
          title="Autocomplete"
          type="boolean"
          {...bindValue('autoCompleteEnabled')}
        />
        <Description>Show autocompletions while you type.</Description>
        <Rule />
        <PaddedPreference
          title="Enable linter"
          type="boolean"
          tooltip="Made possible by eslint"
          {...bindValue('lintEnabled')}
        />
        <Description>Use eslint to find syntax and style errors.</Description>
        <Rule />
        <PaddedPreference
          title="Prettify on save"
          type="boolean"
          tooltip="Made possible by Prettier"
          {...bindValue('prettifyOnSaveEnabled')}
        />
        <Description>Format all code on save with prettier.</Description>
        <Rule />
        <PaddedPreference
          title="VIM mode"
          type="boolean"
          {...bindValue('vimMode')}
        />
        <Rule />
        <PaddedPreference
          title="Editor font size"
          type="number"
          {...bindValue('fontSize')}
        />
        <Rule />
        <PaddedPreference
          title="Editor font family"
          type="string"
          placeholder="Source Code Pro"
          {...bindValue('fontFamily')}
        />
      </PreferenceContainer>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
