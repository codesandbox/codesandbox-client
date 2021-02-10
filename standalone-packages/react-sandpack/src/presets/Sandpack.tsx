import * as React from 'react';
import { SandpackLayout } from '../components/SandpackLayout';
import {
  FileResolver,
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackTheme,
} from '../types';
import { SandpackProvider } from '../contexts/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../templates';
import { sandpackLightTheme } from '../themes';
import { ThemeProvider } from '../contexts/theme-context';
import { getStyleSheet } from '../styles';

let styleInjected = false;

export interface SandpackProps {
  template?: SandpackPredefinedTemplate;
  setup?: SandpackSetup;
  openPaths?: string[]; // Move to options
  activePath?: string; // Move to options
  previewOptions?: {
    showNavigator?: boolean;
    showOpenInCodeSandbox?: boolean; // Map to button or remove?
  };
  codeOptions?: {
    showLineNumbers?: boolean;
    showTabs?: boolean;
    wrapContent?: boolean;
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
  injectStylesAtRuntime?: boolean; // Temporary solution for conditional style injection
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

  // openPaths and activePath override the setup flags
  let openPaths = props.openPaths || [];
  let activePath = props.activePath;

  if (openPaths.length === 0 && props.setup?.files) {
    const inputFiles = props.setup.files;

    // extract open and active files from the custom input files
    Object.keys(inputFiles).forEach(filePath => {
      const file = inputFiles[filePath];
      if (typeof file === 'string') {
        return;
      }

      if (!activePath && file.active) {
        activePath = filePath;
        if (file.open === false && openPaths.length > 0) {
          openPaths.push(filePath); // active file needs to be available even if someone sets it as open = false by accident
        }
      }

      if (file.open) {
        openPaths.push(filePath);
      }
    });

    // If no open flag was specified, all files from the user input are open
    if (openPaths.length === 0) {
      openPaths = Object.keys(props.setup.files);
    }
  }

  if (openPaths.length === 0) {
    // If no files are received, use the project setup / template
    openPaths = Object.keys(projectSetup.files);
  }

  // If no activePath is specified, use the first open file
  if (!activePath) {
    activePath = openPaths[0];
  }

  // If for whatever reason the active path was not set as open, set it
  if (!openPaths.includes(activePath)) {
    openPaths.push(activePath);
  }

  if (!projectSetup.files[activePath]) {
    throw new Error(
      `${activePath} was set as the active file but was not provided`
    );
  }

  const { height, ...otherStyles } = props.customStyle || {};

  const injectStylesAtRuntime = props.injectStylesAtRuntime ?? false;
  if (
    injectStylesAtRuntime &&
    typeof document !== 'undefined' &&
    !styleInjected
  ) {
    const styleTag = document.createElement('style');
    styleTag.textContent = getStyleSheet();
    document.head.appendChild(styleTag);

    styleInjected = true;
  }

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
        <SandpackLayout style={otherStyles}>
          <CodeEditor {...presetCodeOptions} customStyle={{ height }} />
          <Preview {...presetPreviewOptions} customStyle={{ height }} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
