import { generatePackageJSON, IFile, IFiles } from 'smooshpack';
import { SandpackProviderProps } from '../contexts/sandpack-context';
import { SANDBOX_TEMPLATES } from '../templates';
import {
  SandboxTemplate,
  SandpackPredefinedTemplate,
  SandpackSetup,
} from '../types';

export const getSandpackStateFromProps = (props: SandpackProviderProps) => {
  // Merge predefined template with custom setup
  const projectSetup = getSetup(props.template, props.customSetup);

  // openPaths and activePath override the setup flags
  let openPaths = props.openPaths ?? [];
  let activePath = props.activePath;

  if (openPaths.length === 0 && props.customSetup?.files) {
    const inputFiles = props.customSetup.files;

    // extract open and active files from the custom input files
    Object.keys(inputFiles).forEach(filePath => {
      const file = inputFiles[filePath];
      if (typeof file === 'string') {
        openPaths.push(filePath);
        return;
      }

      if (!activePath && file.active) {
        activePath = filePath;
        if (file.hidden === true) {
          openPaths.push(filePath); // active file needs to be available even if someone sets it as hidden by accident
        }
      }

      if (!file.hidden) {
        openPaths.push(filePath);
      }
    });
  }

  if (openPaths.length === 0) {
    // If no files are received, use the project setup / template
    openPaths = Object.keys(projectSetup.files);
  }

  // If no activePath is specified, use the first open file
  if (!activePath) {
    activePath = projectSetup.main || openPaths[0];
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

  const files = generatePackageJSON(
    projectSetup.files,
    projectSetup.dependencies || {},
    projectSetup.entry
  );

  const environment = projectSetup.environment;

  return { openPaths, activePath, files, environment };
};

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
      return SANDBOX_TEMPLATES.vanilla;
    }

    if (!setup.files || Object.keys(setup.files).length === 0) {
      throw new Error(
        `When using the customSetup without a template, you must pass at least one file for sandpack to work`
      );
    }

    // If not template specified, use the setup entirely
    return setup as SandboxTemplate;
  }

  const baseTemplate = SANDBOX_TEMPLATES[template];
  if (!baseTemplate) {
    throw new Error(`Invalid template '${template}' provided.`);
  }

  // If no setup, the template is used entirely
  if (!setup) {
    return baseTemplate;
  }

  // Merge the setup on top of the template
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
