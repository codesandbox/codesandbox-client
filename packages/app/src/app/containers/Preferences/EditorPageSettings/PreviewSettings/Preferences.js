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
          title="Preview on edit"
          type="boolean"
          {...bindValue('livePreviewEnabled')}
          tooltip="Only update on save"
        />
        <Description>Preview the latest code without saving.</Description>
        <Rule />
        <PaddedPreference
          title="Clear console"
          type="boolean"
          {...bindValue('clearConsoleEnabled')}
          tooltip="Clear console when executing"
        />
        <Description>
          Clear your developer console between every execution.
        </Description>
        <Rule />
        <PaddedPreference
          title="Instant preview"
          type="boolean"
          {...bindValue('instantPreviewEnabled')}
        />
        <Description>Show preview on every keypress.</Description>
        <Rule />
        <PaddedPreference
          title="Relative preview URLs"
          type="boolean"
          {...bindValue('relativeUrlsEnabled')}
        />
        <Description>Relative (shortened) preview URLs.</Description>
        <Rule />
        <PaddedPreference
          title="Relative URL"
          type="string"
          placeholder="/"
          {...bindValue('relativeUrl')}
        />
        <Description>
          The relative (shortened) URL to be used. For instance, the default
          &apos;/&apos; relative URL will redirect &apos;/someUrl&apos; to
          &apos;https://codesandbox.io/s/sandboxId&apos;
        </Description>
      </PreferenceContainer>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
