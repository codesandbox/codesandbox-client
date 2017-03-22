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
class Preferences extends React.PureComponent {
  props: Props;

  render() {
    const { preferences, preferencesActions } = this.props;
    return (
      <Container>
        <WorkspaceSubtitle>Code Editor</WorkspaceSubtitle>
        <PreferenceContainer>
          <Preference
            title="Autocomplete"
            enabled={preferences.autoCompleteEnabled}
            onClick={preferencesActions.setAutoCompletePreference}
          />
          <Preference
            title="Prettify on save"
            tooltip="Made possible by Prettier"
            enabled={preferences.prettifyOnSaveEnabled}
            onClick={preferencesActions.setPrettifyOnSavePreference}
          />
          <Preference
            title="VIM Mode"
            enabled={preferences.vimMode}
            onClick={preferencesActions.setVimPreference}
          />
        </PreferenceContainer>
        <WorkspaceSubtitle>Preview</WorkspaceSubtitle>
        <PreferenceContainer>
          <Preference
            title="Live Preview"
            enabled={preferences.livePreviewEnabled}
            onClick={preferencesActions.setLivePreview}
            tooltip="The alternative is to press the refresh button"
          />
        </PreferenceContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
