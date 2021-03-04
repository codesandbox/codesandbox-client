import * as React from 'react';
import { ClasserProvider } from '@code-hike/classer';
import { SandpackPreview } from '../components/Preview';
import { SandpackLayout } from '../common/Layout';
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
  options?: {
    showNavigator?: boolean;
    bundlerUrl?: string;
    classes?: Record<string, string>;
  };
}

export const SandpackRunner: React.FC<SandpackRunnerProps> = ({
  code,
  template,
  customSetup,
  options,
  theme,
}) => {
  const mainFile =
    customSetup?.main ?? SANDBOX_TEMPLATES[template || 'vanilla'].main;

  // Override the main file of the sandbox
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
      bundlerURL={options?.bundlerUrl}
    >
      <ClasserProvider classes={options?.classes}>
        <SandpackLayout theme={theme}>
          <SandpackPreview showNavigator={options?.showNavigator} />
        </SandpackLayout>
      </ClasserProvider>
    </SandpackProvider>
  );
};
