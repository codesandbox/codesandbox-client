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
  Subheading,
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
    <Subheading>Prettier</Subheading>
    <PreferenceContainer>
      <PaddedPreference
        title="Print width"
        value={preferences.autoCompleteEnabled}
        setValue={preferencesActions.setAutoCompletePreference}
      />
      <Description>
        Specify the line length that the printer will wrap on.
      </Description>
      <Rule />

      <PaddedPreference
        title="Tab width"
        value={preferences.lintEnabled}
        setValue={preferencesActions.setLintPreference}
      />
      <Description>
        Specify the number of spaces per indentation-level.
      </Description>
      <Rule />

      <PaddedPreference
        title="Use tabs"
        value={preferences.prettifyOnSaveEnabled}
        setValue={preferencesActions.setPrettifyOnSavePreference}
      />
      <Description>Indent lines with tabs instead of spaces.</Description>
      <Rule />

      <PaddedPreference
        title="Semicolons"
        value={preferences.vimMode}
        setValue={preferencesActions.setVimPreference}
      />
      <Description>Print semicolons at the ends of statements.</Description>
      <Rule />

      <PaddedPreference
        title="Use single quotes"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
      <Description>
        Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
      </Description>
      <Rule />

      <PaddedPreference
        title="Trailing commas"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
      <Description>Print trailing commas wherever possible.</Description>
      <Rule />

      <PaddedPreference
        title="Bracket spacing"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
      <Description>
        Print spaces between brackets in object literals.
      </Description>
      <Rule />

      <PaddedPreference
        title="JSX Brackets"
        value={preferences.fontSize}
        setValue={preferencesActions.setFontSizePreference}
      />
      <Description>
        Put the `>` of a multi-line JSX element at the end of the last line
        instead of being alone on the next line.
      </Description>
    </PreferenceContainer>
  </Container>;

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
