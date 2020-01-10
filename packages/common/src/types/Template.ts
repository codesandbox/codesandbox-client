import { TemplateType } from '../templates';

export type Template = {
  name: TemplateType;
  niceName: string;
  shortid: string;
  url: string;
  main: boolean;
  color: () => string;
  backgroundColor: () => string | undefined;
  popular: boolean;
  showOnHomePage: boolean;
  distDir: string;
  netlify: boolean;
  isTypescript: boolean;
  externalResourcesEnabled: boolean;
  showCube: boolean;
  isServer: boolean;
  mainFile: undefined | string[];
};
