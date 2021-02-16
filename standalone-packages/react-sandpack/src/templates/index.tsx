import { SandpackPredefinedTemplate, SandboxTemplate } from '../types';
import { REACT_TEMPLATE } from './react';
import { VANILLA_TEMPLATE } from './vanilla';
import { VUE_TEMPLATE } from './vue';

export const SANDBOX_TEMPLATES: Record<
  SandpackPredefinedTemplate,
  SandboxTemplate
> = {
  react: REACT_TEMPLATE,
  vue: VUE_TEMPLATE,
  vanilla: VANILLA_TEMPLATE,
};
