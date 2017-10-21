// flow-typed signature: a337b8eb7d61407ef752cc322846aeb7
// flow-typed version: b43dff3e0e/path-exists_v3.x.x/flow_>=v0.25.x

declare module 'path-exists' {
  declare module.exports: {
    (filePath: string): Promise<boolean>,
    sync(filePath: string): boolean,
  };
}
