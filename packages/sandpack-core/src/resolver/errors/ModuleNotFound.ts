export class ModuleNotFoundError extends Error {
  filepath: string;
  parent: string;
  code: string = 'MODULE_NOT_FOUND';

  constructor(filepath: string, parent: string) {
    super(`Cannot find module ${filepath} in ${parent}`);
    this.parent = parent;
    this.filepath = filepath;
  }
}
