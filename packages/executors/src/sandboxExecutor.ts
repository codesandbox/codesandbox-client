import { IExecutor } from './executor';

export class SandboxExecutor implements IExecutor {
  sandboxId?: string | undefined;
  
  initialize(): Promise<void> {
    return Promise.resolve();
  }

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
