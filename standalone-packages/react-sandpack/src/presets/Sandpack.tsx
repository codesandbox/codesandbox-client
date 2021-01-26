import * as React from 'react';
import { SandpackLayout } from '../components/SandpackLayout';
import {
  FileResolver,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackTheme,
} from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../templates';
import { sandpackLightTheme } from '../themes';
import { ThemeProvider, compileStitchesTheme } from '../utils/theme-context';

export interface SandpackProps {
  template?: SandpackPredefinedTemplate;
  setup?: SandpackSetup;
  openPaths?: string[];
  activePath?: string;
  previewOptions?: {
    showNavigator?: boolean;
    showOpenInCodeSandbox?: boolean;
  };
  codeOptions?: {
    showLineNumbers?: boolean;
    showTabs?: boolean;
  };
  bundlerOptions?: {
    bundlerURL?: string;
    skipEval?: boolean;
    fileResolver?: FileResolver;
  };
  executionOptions?: {
    autorun?: boolean;
    recompileMode?: 'immediate' | 'delayed';
    recompileDelay?: number;
  };
  theme?: SandpackTheme;
  customStyle?: React.CSSProperties;
}

export const Sandpack: React.FC<SandpackProps> = props => {
  const presetPreviewOptions = {
    ...{ showOpenInCodeSandbox: false, showNavigator: true },
    ...props.previewOptions,
  };

  const presetCodeOptions = {
    ...{ showTabs: true },
    ...props.codeOptions,
  };

  const presetExecutionOptions = {
    ...{ autorun: true },
    ...props.executionOptions,
  };

  const theme = props.theme || sandpackLightTheme;

  const projectSetup = getSetup(props.template, props.setup);

  let openPaths = props.openPaths || [];
  if (openPaths.length === 0) {
    // If no open paths are passed, use the setup files, or fallback to the entire project file list
    openPaths = props.setup?.files
      ? Object.keys(props.setup.files)
      : Object.keys(projectSetup.files);
  }

  const activePath = props.activePath || projectSetup.main;
  if (!projectSetup.files[activePath]) {
    throw new Error(
      `${activePath} was set as the active file but was not provided`
    );
  }

  const className = compileStitchesTheme(theme);

  const { height, ...otherStyles } = props.customStyle || {};

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      environment={projectSetup.environment}
      openPaths={openPaths}
      activePath={activePath}
      {...presetExecutionOptions}
      {...props.bundlerOptions}
    >
      <ThemeProvider value={theme}>
        <SandpackLayout
          style={otherStyles}
          css={{
            '& > *': {
              height,
            },
          }}
          className={className}
        >
          <CodeEditor {...presetCodeOptions} />
          <Preview {...presetPreviewOptions} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
