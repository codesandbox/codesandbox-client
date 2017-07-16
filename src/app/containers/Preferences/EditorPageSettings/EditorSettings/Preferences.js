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

const Preferences = ({ preferences, preferencesActions }: Props) =>
  <Container>
    <PreferenceContainer>
      <PaddedPreference
        title="Autocomplete"
        value={preferences.autoCompleteEnabled}
        setValue={preferencesActions.setAutoCompletePreference}
      />
      <Description>Show autocompletions while you type.</Description>
      <Rule />
      <PaddedPreference
        title="Enable linter"
        tooltip="Made possible by eslint"
        value={preferences.lintEnabled}
        setValue={preferencesActions.setLintPreference}
      />
      <Description>Use eslint to find syntax and style errors.</Description>
      <Rule />
      <PaddedPreference
        title="Prettify on save"
        tooltip="Made possible by Prettier"
        value={preferences.prettifyOnSaveEnabled}
        setValue={preferencesActions.setPrettifyOnSavePreference}
      />
      <Description>Format all code on save with prettier.</Description>
      <Rule />
      <PaddedPreference
        title="VIM mode"
        value={preferences.vimMode}
        setValue={preferencesActions.setVimPreference}
      />
      <Rule />
      <PaddedPreference
        title="Editor font size"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
    </PreferenceContainer>
  </Container>;

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
