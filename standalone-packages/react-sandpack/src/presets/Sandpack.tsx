import * as React from 'react';
import { SandpackLayout } from '../components/SandpackLayout';
import {
  FileResolver,
  SandpackFiles,
  SandpackPredefinedTemplate,
  SandpackPredefinedTheme,
  SandpackSetup,
  SandpackPartialTheme,
} from '../types';
import { SandpackProvider } from '../contexts/sandpack-context';
import { CodeEditor, CodeEditorOptions } from '../components/CodeEditor';
import { Preview, PreviewOptions } from '../components/Preview';

export interface SandpackProps {
  files?: SandpackFiles;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;

  theme?: SandpackPredefinedTheme | SandpackPartialTheme;
  customStyle?: React.CSSProperties;

  options?: {
    openPaths?: string[];
    activePath?: string;

    editorWidthPercentage?: number;

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
  // Combine files with customSetup to create the user input structure
  const userInputSetup = props.files
    ? {
        ...props.customSetup,
        files: {
          ...props.customSetup?.files,
          ...props.files,
        },
      }
    : props.customSetup;

  const previewOptions: PreviewOptions = {
    showNavigator: props.options?.showNavigator,
  };

  const codeEditorOptions: CodeEditorOptions = {
    showTabs: props.options?.showTabs,
    showLineNumbers: props.options?.showLineNumbers,
    wrapContent: props.options?.wrapContent,
  };

  const providerOptions = {
    openPaths: props.options?.openPaths,
    activePath: props.options?.activePath,
    autorun: props.options?.autorun ?? true,
    recompileMode: props.options?.recompileMode,
    recompileDelay: props.options?.recompileDelay,
    bundlerURL: props.options?.bundlerURL,
    skipEval: props.options?.skipEval,
    fileResolver: props.options?.fileResolver,
  };

  const { height, ...otherStyles } = props.customStyle || {};
  const editorPart = props.options?.editorWidthPercentage || 50;
  const previewPart = 100 - editorPart;

  return (
    <SandpackProvider
      template={props.template}
      customSetup={userInputSetup}
      theme={props.theme}
      {...providerOptions}
    >
      <SandpackLayout style={otherStyles}>
        <CodeEditor
          {...codeEditorOptions}
          customStyle={{
            height,
            flexGrow: editorPart,
            flexShrink: editorPart,
            minWidth: 700 * (editorPart / (previewPart + editorPart)),
          }}
        />
        <Preview
          {...previewOptions}
          customStyle={{
            height,
            flexGrow: previewPart,
            flexShrink: previewPart,
            minWidth: 700 * (previewPart / (previewPart + editorPart)),
          }}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
};
