import * as React from 'react';
import { connect } from 'app/fluent';

import {
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';

export default connect()
  .with(({ state, signals }) => ({
    prettierConfig: state.preferences.settings.prettierConfig,
    settingChanged: signals.preferences.settingChanged
  }))
  .to(
    function Prettier({ prettierConfig, settingChanged }) {
      const bindValue = name => ({
        value: prettierConfig[name],
        setValue: value =>
          settingChanged({
            name: `prettierConfig.${name}`,
            value,
          }),
      });

      return (
        <SubContainer>
          <PreferenceContainer>
            <SubDescription>
              This configuration can be overridden by a{' '}
              <a
                href="https://prettier.io/docs/en/configuration.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                .prettierrc
              </a>{' '}
              JSON file at the root of the sandbox.
            </SubDescription>
            <Rule />
            <PaddedPreference
              title="Print width"
              type="number"
              {...bindValue('printWidth')}
            />
            <SubDescription>
              Specify the line length that the printer will wrap on.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="Tab width"
              type="number"
              {...bindValue('tabWidth')}
            />
            <SubDescription>
              Specify the number of spaces per indentation-level.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="Use tabs"
              type="boolean"
              {...bindValue('useTabs')}
            />
            <SubDescription>
              Indent lines with tabs instead of spaces.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="Semicolons"
              type="boolean"
              {...bindValue('semi')}
            />
            <SubDescription>
              Print semicolons at the ends of statements.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="Use single quotes"
              type="boolean"
              {...bindValue('singleQuote')}
            />
            <SubDescription>
              Use {"'"}single{"'"} quotes instead of {'"'}double{'"'} quotes.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="Trailing commas"
              type="dropdown"
              options={['none', 'es5', 'all']}
              {...bindValue('traillingComma')}
            />
            <SubDescription>
              Print trailing commas wherever possible.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="Bracket spacing"
              type="boolean"
              {...bindValue('bracketSpacing')}
            />
            <SubDescription>
              Print spaces between brackets in object literals.
            </SubDescription>
            <Rule />

            <PaddedPreference
              title="JSX Brackets"
              type="boolean"
              {...bindValue('jsxBracketSameLine')}
            />
            <SubDescription>
              Put the `{'>'}` of a multi-line JSX element at the end of the last
              line instead of being alone on the next line.
            </SubDescription>
          </PreferenceContainer>
        </SubContainer>
      );
    }
  )
