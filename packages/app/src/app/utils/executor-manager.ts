import getDefinition from '@codesandbox/common/lib/templates';
import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import { Sandbox } from '@codesandbox/common/lib/types';
import {
  IFiles,
  IExecutor,
  SandboxExecutor,
  ServerExecutor,
} from '@codesandbox/executors';

function getExecutorType(isServer: boolean) {
  if (isServer) {
    return ServerExecutor;
  }

  return SandboxExecutor;
}

function getModulesToSend(sandbox: Sandbox): IFiles {
  const modulesObject: IFiles = {};

  sandbox.modules.forEach(m => {
    const { path } = m;
    if (path) {
      modulesObject[path] = {
        code: m.code,
        savedCode: m.savedCode,
        path,
        isBinary: m.isBinary,
      };
    }
  });

  if (!modulesObject['/package.json']) {
    modulesObject['/package.json'] = {
      code: generateFileFromSandbox(sandbox),
      savedCode: null,
      path: '/package.json',
      isBinary: false,
    };
  }

  return modulesObject;
}

/**
 * In CodeSandbox we use an interface to send files to the bundler. A service that talks to a "bundler"
 * is called an "executor". We currently have two executors:
 *
 * - SandboxExecutor, this is the browser based bundler
 * - ServerExectutor, this is our SSE system that we talk to. This system executes the code in a Docker container
 *
 * An executor is responsible for connecting and talking to a service, it exposes some methods to allow other services
 * to talk to it.
 *
 * This manager is responsible for instantiating the right executor (based on the sandbox) and making it globally available.
 * Until we run Overmind as our state management we'll have to put this as a singleton for now.
 */
class ExecutorsManager {
  executor: IExecutor | null = null;

  async initializeExecutor(sandbox: Sandbox) {
    const { isServer } = getDefinition(sandbox.template);
    const ExecutorType = getExecutorType(isServer);

    // Can we reuse the existing executor or do we need to create a new one?
    if (this.executor && !(this.executor instanceof ExecutorType)) {
      await this.executor.dispose();

      this.executor = null;
    }

    if (!this.executor) {
      this.executor = new ExecutorType();
    }

    const sseHost = process.env.ENDPOINT || 'https://codesandbox.io';

    await this.executor!.initialize({
      sandboxId: sandbox.id,
      files: getModulesToSend(sandbox),
      // this is in the type idk what is wrong
      // @ts-ignore
      host: sseHost,
    });

    return this.executor!;
  }

  async setupExecutor() {
    if (this.executor) {
      this.executor.setup();
    }
  }

  isServer() {
    return this.executor instanceof ServerExecutor;
  }

  updateFiles(sandbox: Sandbox) {
    const modules = getModulesToSend(sandbox);

    if (this.executor) {
      this.executor.updateFiles(modules);
    }
  }

  /**
   * Get the current executor. There are two states here that could break this:
   *
   * - The executor is not defined yet. This should be impossible because the editor only renders when the sandbox
   *   has been loaded and thus the executor has been loaded.
   * - The executor changes while listeners have been registered. All the listeners registered here are very specific
   *   to either the sandbox or the server executor. Changing the executor would probably also result in components unmounting/
   *   remounting and registering new listeners.
   */
  getExecutor(): IExecutor | null {
    return this.executor;
  }

  async closeExecutor() {
    if (this.executor) {
      await this.executor.dispose();
      this.executor = null;
    }
  }
}

export const executorsManager = new ExecutorsManager();
