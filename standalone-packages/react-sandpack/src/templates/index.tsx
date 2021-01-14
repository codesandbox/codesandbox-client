import { SandpackPredefinedTemplate, SandboxTemplate } from '../types';
import { REACT_TEMPLATE } from './react';
import { VANILLA_TEMPLATE } from './vanilla';
import { VUE_TEMPLATE } from './vue';

export const getSetup = (
  template?: SandpackPredefinedTemplate,
  customSetup?: Partial<SandboxTemplate>
): SandboxTemplate => {
  if (!template) {
    // If not input, default to vanilla
    if (!customSetup) {
      return SANDBOX_TEMPLATES.vanilla as SandboxTemplate;
    }

    // If not template specified, use the customSetup entirely
    return customSetup as SandboxTemplate;
  }

  // If no custom setup, the template is used entirely
  if (!customSetup) {
    return SANDBOX_TEMPLATES[template] as SandboxTemplate;
  }

  // Merge the custom setup on top of the template
  const baseTemplate = SANDBOX_TEMPLATES[template] as SandboxTemplate;
  return {
    files: { ...baseTemplate.files, ...customSetup.files },
    dependencies: {
      ...baseTemplate.dependencies,
      ...customSetup.dependencies,
    },
    entry: customSetup.entry || baseTemplate.entry,
    main: customSetup.main || baseTemplate.main,
    environment: customSetup.environment || baseTemplate.environment,
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
