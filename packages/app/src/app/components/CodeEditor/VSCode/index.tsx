import getTemplate from '@codesandbox/common/lib/templates';
import getUI from '@codesandbox/common/lib/templates/configuration/ui';
import theme from '@codesandbox/common/lib/theme';
import { useOvermind } from 'app/overmind';
import { json } from 'overmind';
import React, { useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { Configuration } from './Configuration';
import { Container, GlobalStyles } from './elements';

import './icon-theme.css';
import './workbench-theme.css';

export const VSCode: React.FunctionComponent = () => {
  const { state, actions, effects } = useOvermind();
  const containerEl = useRef(null);

  useEffect(() => {
    const rootEl = containerEl.current;
    const mainContainer = effects.vscode.getEditorElement(
      (modulePath: string) => {
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
                  currentModule={json(state.editor.currentModule)}
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
    state.editor.currentModule,
    state.editor.currentSandbox,
    state.editor.currentSandbox.template,
  ]);

  return (
    <Container ref={containerEl}>
      <GlobalStyles />
    </Container>
  );
};
