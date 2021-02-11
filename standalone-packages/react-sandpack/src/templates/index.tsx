import { IFile, IFiles } from 'smooshpack';
import {
  SandpackPredefinedTemplate,
  SandboxTemplate,
  SandpackSetup,
} from '../types';
import { REACT_TEMPLATE } from './react';
import { VANILLA_TEMPLATE } from './vanilla';
import { VUE_TEMPLATE } from './vue';

// The template is predefined (eg: react, vue, vanilla)
// The setup can overwrite anything from the template (eg: files, dependencies, environment, etc.)
export const getSetup = (
  template?: SandpackPredefinedTemplate,
  inputSetup?: SandpackSetup
): SandboxTemplate => {
  // The input setup might have files in the simple form Record<string, string>
  // so we convert them to the sandbox template format

  const setup = createSetupFromUserInput(inputSetup);

  if (!template) {
    // If not input, default to vanilla
    if (!setup) {
      return SANDBOX_TEMPLATES.vanilla as SandboxTemplate;
    }

    // If not template specified, use the setup entirely
    return setup as SandboxTemplate;
  }

  // If no setup, the template is used entirely
  if (!setup) {
    return SANDBOX_TEMPLATES[template] as SandboxTemplate;
  }

  // Merge the setup on top of the template
  const baseTemplate = SANDBOX_TEMPLATES[template] as SandboxTemplate;
  return {
    files: { ...baseTemplate.files, ...setup.files },
    dependencies: {
      ...baseTemplate.dependencies,
      ...setup.dependencies,
    },
    entry: setup.entry || baseTemplate.entry,
    main: setup.main || baseTemplate.main,
    environment: setup.environment || baseTemplate.environment,
  };
};

export const SANDBOX_TEMPLATES: Partial<Record<
  SandpackPredefinedTemplate,
  SandboxTemplate
>> = {
  react: REACT_TEMPLATE,
  vue: VUE_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
};

const createSetupFromUserInput = (
  setup?: SandpackSetup
): Partial<SandboxTemplate> | null => {
  if (!setup) {
    return null;
  }

  if (!setup.files) {
    return setup as Partial<SandboxTemplate>;
  }

  const { files } = setup;

  const convertedFiles = Object.keys(files).reduce((acc: IFiles, key) => {
    if (typeof files[key] === 'string') {
      acc[key] = { code: files[key] as string };
    } else {
      acc[key] = files[key] as IFile;
    }

    return acc;
  }, {});

  return {
    ...setup,
    files: convertedFiles,
  };
};
