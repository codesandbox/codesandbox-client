import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import preferencesActionCreators from 'app/store/preferences/actions';
import Preference from 'app/components/Preference';
import Margin from '../../../../components/spacing/Margin';

const Container = styled.div`
  color: ${props => props.theme.white};
  width: 100%;

  div {
    &:first-child {
      padding-top: 0;
    }
  }
`;

const PreferenceContainer = styled.div`padding-top: 0.5rem;`;

const PaddedPreference = styled(Preference)`
  padding: 0;
  font-weight: 400;
`;

const Description = styled.div`
  margin-top: 0.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: .875rem;
`;

const Header = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0;
  font-weight: 500;
`;

const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 1rem 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

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
    <Header>Code Editor</Header>
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
    <Margin top={2}>
      <Header>Preview</Header>
      <PreferenceContainer>
        <PaddedPreference
          title="Preview on edit"
          value={preferences.livePreviewEnabled}
          setValue={preferencesActions.setLivePreview}
          tooltip="Only update on save"
        />
        <Description>Preview the latest code without saving.</Description>
        <Rule />
        <PaddedPreference
          title="Clear console"
          value={preferences.clearConsoleEnabled}
          setValue={preferencesActions.setClearConsolePreference}
          tooltip="Clear console when executing"
        />
        <Description>
          Clear your developer console between every execution.
        </Description>
        <Rule />
        <PaddedPreference
          title="Instant preview"
          value={preferences.instantPreviewEnabled}
          setValue={preferencesActions.setInstantPreview}
        />
        <Description>Show preview on every keypress.</Description>
      </PreferenceContainer>
    </Margin>
  </Container>;

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
