import React from 'react';
import { render } from 'react-dom';
import getUI from 'common/templates/configuration/ui';
import { resolveModule } from 'common/sandbox/modules';
import { ThemeProvider } from 'styled-components';
import theme from 'common/theme';

import Configuration from './Configuration';

export function getCustomEditorAPI(template, sandbox, props) {
  return {
    getCustomEditor: (modulePath: string) => {
      const config = template.configurationFiles[modulePath];

      const ui = config && getUI(config.type);
      return (
        ui &&
        ui.ConfigWizard &&
        ((container, extraProps) => {
          const currentModule = resolveModule(
            modulePath,
            sandbox.modules,
            sandbox.directories
          );
          return render(
            <ThemeProvider theme={theme}>
              <Configuration
                onChange={props.onChange}
                // Copy the object, we don't want mutations in the component
                currentModule={currentModule.toJSON()}
                config={config}
                sandbox={sandbox}
                {...extraProps}
              />
            </ThemeProvider>,
            container
          );
        })
      );
    },
  };
}
