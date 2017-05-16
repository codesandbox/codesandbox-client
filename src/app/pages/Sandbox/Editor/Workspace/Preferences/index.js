import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { preferencesSelector } from 'app/store/preferences/selectors';
import preferencesActionCreators from 'app/store/preferences/actions';

import WorkspaceSubtitle from '../WorkspaceSubtitle';

import Preference from './Preference';

const Container = styled.div`
  color: ${props => props.theme.white};
  font-size: .875rem;
`;

const PreferenceContainer = styled.div`
  padding-top: 0.5rem;
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
      <Preference
        title="Autocomplete"
        value={preferences.autoCompleteEnabled}
        setValue={preferencesActions.setAutoCompletePreference}
      />
      <Preference
        title="Linter"
        tooltip="Made possible by eslint"
        value={preferences.lintEnabled}
        setValue={preferencesActions.setLintPreference}
      />
      <Preference
        title="Prettify on save"
        tooltip="Made possible by Prettier"
        value={preferences.prettifyOnSaveEnabled}
        setValue={preferencesActions.setPrettifyOnSavePreference}
      />
      <Preference
        title="VIM Mode"
        value={preferences.vimMode}
        setValue={preferencesActions.setVimPreference}
      />
      <Preference
        title="Font size"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
    </PreferenceContainer>
    <WorkspaceSubtitle>Preview</WorkspaceSubtitle>
    <PreferenceContainer>
      <Preference
        title="Live Preview"
        value={preferences.livePreviewEnabled}
        setValue={preferencesActions.setLivePreview}
        tooltip="Only update on save"
      />
      <Preference
        title="Instant preview"
        value={preferences.instantPreviewEnabled}
        setValue={preferencesActions.setInstantPreview}
      />
    </PreferenceContainer>
  </Container>
);

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
