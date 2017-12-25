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
class Prettier extends React.PureComponent {
  props: Props;

  constructor(props) {
    super(props);

    this.state = props.preferences.prettierConfig;
  }

  setPrettierOption = key => val => {
    this.setState({ [key]: val }, () => {
      this.props.preferencesActions.setPreference({
        prettierConfig: this.state,
      });
    });
  };

  render() {
    const state = this.state;
    return (
      <Container>
        <PreferenceContainer>
          <Description>
            This configuration can be overridden by a{' '}
            <a
              href="https://prettier.io/docs/en/configuration.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              .prettierrc
            </a>{' '}
            JSON file at the root of the sandbox.
          </Description>
          <Rule />

          <PaddedPreference
            title="Print width"
            type="number"
            value={state.printWidth}
            setValue={this.setPrettierOption('printWidth')}
          />
          <Description>
            Specify the line length that the printer will wrap on.
          </Description>
          <Rule />

          <PaddedPreference
            title="Tab width"
            type="number"
            value={state.tabWidth}
            setValue={this.setPrettierOption('tabWidth')}
          />
          <Description>
            Specify the number of spaces per indentation-level.
          </Description>
          <Rule />

          <PaddedPreference
            title="Use tabs"
            type="boolean"
            value={state.useTabs}
            setValue={this.setPrettierOption('useTabs')}
          />
          <Description>Indent lines with tabs instead of spaces.</Description>
          <Rule />

          <PaddedPreference
            title="Semicolons"
            type="boolean"
            value={state.semi}
            setValue={this.setPrettierOption('semi')}
          />
          <Description>Print semicolons at the ends of statements.</Description>
          <Rule />

          <PaddedPreference
            title="Use single quotes"
            type="boolean"
            value={state.singleQuote}
            setValue={this.setPrettierOption('singleQuote')}
          />
          <Description>
            Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
          </Description>
          <Rule />

          <PaddedPreference
            title="Trailing commas"
            type="dropdown"
            options={['none', 'es5', 'all']}
            value={state.trailingComma}
            setValue={this.setPrettierOption('trailingComma')}
          />
          <Description>Print trailing commas wherever possible.</Description>
          <Rule />

          <PaddedPreference
            title="Bracket spacing"
            type="boolean"
            value={state.bracketSpacing}
            setValue={this.setPrettierOption('bracketSpacing')}
          />
          <Description>
            Print spaces between brackets in object literals.
          </Description>
          <Rule />

          <PaddedPreference
            title="JSX Brackets"
            type="boolean"
            value={state.jsxBracketSameLine}
            setValue={this.setPrettierOption('jsxBracketSameLine')}
          />
          <Description>
            Put the `{'>'}` of a multi-line JSX element at the end of the last
            line instead of being alone on the next line.
          </Description>
        </PreferenceContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prettier);
