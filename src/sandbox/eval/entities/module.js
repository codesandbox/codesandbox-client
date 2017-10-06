// @flow

export type Module = {
  path: string,
  code: string,
  requires?: Array<string>,
};
