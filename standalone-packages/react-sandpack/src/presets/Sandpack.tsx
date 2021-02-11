import * as React from 'react';
import { SandpackLayout } from '../components/SandpackLayout';
import {
  FileResolver,
  SandboxTemplate,
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackPredefinedTheme,
  SandpackSetup,
  SandpackPartialTheme,
} from '../types';
import { SandpackProvider } from '../contexts/sandpack-context';
import { CodeEditor, CodeEditorOptions } from '../components/CodeEditor';
import { Preview, PreviewOptions } from '../components/Preview';
import { getSetup } from '../templates';
import { ThemeProvider } from '../contexts/theme-context';

export interface SandpackProps {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  theme?: SandpackPredefinedTheme | SandpackPartialTheme;
  customStyle?: React.CSSProperties;

  options?: {
    openPaths?: string[];
    activePath?: string;

    showNavigator?: boolean;

    showLineNumbers?: boolean;
    showTabs?: boolean;
    wrapContent?: boolean;

    bundlerURL?: string;
    skipEval?: boolean;
    fileResolver?: FileResolver;

    autorun?: boolean;
    recompileMode?: 'immediate' | 'delayed';
    recompileDelay?: number;
  };
}

export const Sandpack: React.FC<SandpackProps> = props => {
  const userInputSetup: SandpackSetup = {
    ...props.customSetup,
    files: {
      ...props.customSetup?.files,
      ...props.files,
    },
  };
  const projectSetup = getSetup(props.template, userInputSetup);
  const { activePath, openPaths } = getInitialEditorState(props, projectSetup);

  const previewOptions: PreviewOptions = {
    showNavigator: props.options?.showNavigator,
  };

  const codeEditorOptions: CodeEditorOptions = {
    showTabs: props.options?.showTabs ?? openPaths.length > 1,
    showLineNumbers: props.options?.showLineNumbers,
    wrapContent: props.options?.wrapContent,
  };

  const providerOptions = {
    autorun: props.options?.autorun ?? true,
    recompileMode: props.options?.recompileMode,
    recompileDelay: props.options?.recompileDelay,
    bundlerURL: props.options?.bundlerURL,
    skipEval: props.options?.skipEval,
    fileResolver: props.options?.fileResolver,
  };

  const { height, ...otherStyles } = props.customStyle || {};

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      environment={projectSetup.environment}
      openPaths={openPaths}
      activePath={activePath}
      {...providerOptions}
    >
      <ThemeProvider theme={props.theme}>
        <SandpackLayout style={otherStyles}>
          <CodeEditor {...codeEditorOptions} customStyle={{ height }} />
          <Preview {...previewOptions} customStyle={{ height }} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};

const getInitialEditorState = (
  props: SandpackProps,
  projectSetup: SandboxTemplate
) => {
  // openPaths and activePath override the setup flags
  let openPaths = props.options?.openPaths || [];
  let activePath = props.options?.activePath;

  if (openPaths.length === 0 && props.files) {
    const inputFiles = props.files;

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
      openPaths = Object.keys(props.files);
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

  return { openPaths, activePath };
};
