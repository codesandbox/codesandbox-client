export type Module = {
  path: string;
  url?: string;
  code: string;
  requires?: Array<string>;
  downloaded?: boolean;
  /** Whether the module was created as stub for the "browsers" package field */
  stubbed?: boolean;
  parent?: Module;
};
