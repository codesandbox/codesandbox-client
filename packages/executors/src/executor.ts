export interface IFiles {
  [path: string]: {
    code: string | null;
    savedCode: string | null;
    isBinary: boolean;
    path: string;
  };
}

export interface ISetupParams {
  /**
   * Eg. https://codesandbox.io
   */
  host: string;
  files: IFiles;
  sandboxId: string;
}

/**
 * An executor is responsible for the communication with the service that executes
 * the code. Examples of these services are:
 *
 * - Sandbox Service: this is the browser bundler
 * - SSE Service: this is an external container that executes the code
 *
 * The executor will set these services up, and update them when files change. It also
 * serves as the interface to communicate with the service.
 */
export interface IExecutor {
  sandboxId?: string;

  initialize(params: ISetupParams): Promise<void>;

  setup(): Promise<void>;
  dispose(): Promise<void>;
  updateFiles(newFiles: IFiles): void;

  on(event: string, listener: (data: any) => void): void;
  emit(event: string, data?: any): void;
}
