import * as React from 'react';

import { Preview } from '../components/Preview';
import { SandpackLayout } from '../components/SandpackLayout';
import { SandpackProvider } from '../contexts/sandpack-context';
import {
  SandpackPartialTheme,
  SandpackPredefinedTemplate,
  SandpackPredefinedTheme,
  SandpackSetup,
} from '../types';
import { SANDBOX_TEMPLATES } from '../templates';

export interface SandpackRunnerProps {
  code?: string;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
  theme?: SandpackPredefinedTheme | SandpackPartialTheme;
  customStyle?: React.CSSProperties;
  options?: {
    showNavigator?: boolean;
    bundlerUrl?: string;
  };
}

export const SandpackRunner: React.FC<SandpackRunnerProps> = ({
  code,
  template,
  customSetup,
  options,
  theme,
  customStyle,
}) => {
  const mainFile =
    customSetup?.main ?? SANDBOX_TEMPLATES[template || 'vanilla'].main;

  const userInput = code
    ? {
        ...customSetup,
        files: {
          ...customSetup?.files,
          [mainFile]: code,
        },
      }
    : customSetup;

  return (
    <SandpackProvider
      template={template}
      customSetup={userInput}
      theme={theme}
      bundlerURL={options?.bundlerUrl}
    >
      <SandpackLayout style={customStyle}>
        <Preview showNavigator={options?.showNavigator} />
      </SandpackLayout>
    </SandpackProvider>
  );
};
