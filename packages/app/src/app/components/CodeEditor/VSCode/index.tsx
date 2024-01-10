import './icon-theme.css';
import './workbench-theme.css';

import getTemplate from '@codesandbox/common/lib/templates';
import getUI from '@codesandbox/common/lib/templates/configuration/ui';
import theme from '@codesandbox/common/lib/theme';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { json } from 'overmind';
import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { Configuration } from './Configuration';
import { Container, GlobalStyles } from './elements';

export const VSCode: React.FunctionComponent = () => {
  const state = useAppState();
  const actions = useActions();
  const effects = useEffects();
  const containerEl = useRef(null);

  const getCurrentModule = React.useCallback(
    () => state.editor.currentModule,
    [] // eslint-disable-line
  );
  const currentSandboxTemplate = state.editor.currentSandbox?.template;
  useEffect(() => {
    const rootEl = containerEl.current;
    const mainContainer = effects.vscode.getEditorElement(
      (modulePath: string) => {
        if (!state.editor.currentSandbox) {
          return false;
        }

        const template = getTemplate(state.editor.currentSandbox.template);
        const config = template.configurationFiles[modulePath];

        const ui = config && getUI(config.type);
        return (
          ui &&
          ui.ConfigWizard &&
          ((container, extraProps) =>
            render(
              <ThemeProvider theme={theme}>
                <Configuration
                  onChange={(code, moduleShortid) =>
                    actions.editor.codeChanged({ code, moduleShortid })
                  }
                  // Copy the object, we don't want mutations in the component
                  currentModule={json(getCurrentModule())}
                  config={config}
                  sandbox={state.editor.currentSandbox}
                  {...(extraProps as any)}
                />
              </ThemeProvider>,
              container
            ))
        );
      }
    );

    rootEl.appendChild(mainContainer);
    const { width, height } = rootEl.getBoundingClientRect();
    effects.vscode.updateLayout(width, height);

    document.getElementById('root').classList.add('monaco-shell');

    return () => {
      document.getElementById('root').classList.remove('monaco-shell');
    };
  }, [
    actions.editor,
    effects.vscode,
    state.editor.currentSandbox,
    currentSandboxTemplate,
    getCurrentModule,
  ]);

  return (
    <Container id="vscode-container" ref={containerEl}>
      <GlobalStyles />
    </Container>
  );
};
