import { IExecutor } from './executor';

export class SandboxExecutor implements IExecutor {
  public setup() {
    return Promise.resolve();
  }

  public dispose() {
    return Promise.resolve();
  }

  public updateFiles() {}

  public emit() {}

  public on() {}
}
