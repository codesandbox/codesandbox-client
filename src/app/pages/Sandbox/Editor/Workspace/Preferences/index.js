import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import preferencesActionCreators from 'app/store/preferences/actions';
import Preference from 'app/components/Preference';

import WorkspaceSubtitle from '../WorkspaceSubtitle';

const Container = styled.div`
  color: ${props => props.theme.white};
  font-size: .875rem;

  div {
    &:first-child {
      padding-top: 0;
    }
  }
`;

const PreferenceContainer = styled.div`
  padding-top: 0.5rem;
`;

const PaddedPreference = styled(Preference)`
  padding: 0.5rem 1rem;
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

const Preferences = ({ preferences, preferencesActions }: Props) => (
  <Container>
    <WorkspaceSubtitle>Code Editor</WorkspaceSubtitle>
    <PreferenceContainer>
      <PaddedPreference
        title="Autocomplete"
        value={preferences.autoCompleteEnabled}
        setValue={preferencesActions.setAutoCompletePreference}
      />
      <PaddedPreference
        title="Linter"
        tooltip="Made possible by eslint"
        value={preferences.lintEnabled}
        setValue={preferencesActions.setLintPreference}
      />
      <PaddedPreference
        title="Prettify on save"
        tooltip="Made possible by Prettier"
        value={preferences.prettifyOnSaveEnabled}
        setValue={preferencesActions.setPrettifyOnSavePreference}
      />
      <PaddedPreference
        title="VIM Mode"
        value={preferences.vimMode}
        setValue={preferencesActions.setVimPreference}
      />
      <PaddedPreference
        title="Font size"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
    </PreferenceContainer>
    <WorkspaceSubtitle>Preview</WorkspaceSubtitle>
    <PreferenceContainer>
      <PaddedPreference
        title="Live Preview"
        value={preferences.livePreviewEnabled}
        setValue={preferencesActions.setLivePreview}
        tooltip="Only update on save"
      />
      <PaddedPreference
        title="Clear console"
        value={preferences.clearConsoleEnabled}
        setValue={preferencesActions.setClearConsolePreference}
        tooltip="Clear console when executing"
      />
      <PaddedPreference
        title="Instant preview"
        value={preferences.instantPreviewEnabled}
        setValue={preferencesActions.setInstantPreview}
      />
    </PreferenceContainer>
  </Container>
);

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
