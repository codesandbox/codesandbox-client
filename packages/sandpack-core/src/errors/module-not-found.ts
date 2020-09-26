import { SandboxError } from './sandbox-error';

export class ModuleNotFoundError extends SandboxError {
  type = 'module-not-found';
  severity = 'error' as const;
  path: string;
  isDependency: boolean;
  suggestions = [];

  constructor(path: string, isDependency: boolean, currentPath?: string) {
    super();
    this.path = path;
    this.isDependency = isDependency;

    this.name = 'ModuleNotFoundError';
    this.message = `Could not find module in path: '${path}'`;

    if (currentPath) {
      this.message += ` relative to '${currentPath}'`;
    }
  }
}
