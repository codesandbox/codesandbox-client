import { dispatch, listen, registerFrame, Protocol } from 'codesandbox-api';
import { getTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';

import isEqual from 'lodash.isequal';

import generatePackageJSON, {
  getPackageJSON,
} from '../utils/generate-package-json';
import version from '../version';
import { IManagerState, IModuleError, ManagerStatus } from '../typings/types';

export interface IManagerOptions {
  /**
   * Location of the bundler.
   */
  bundlerURL?: string;
  /**
   * Width of iframe.
   */
  width?: string;
  /**
   * Height of iframe.
   */
  height?: string;
  /**
   * If we should skip the third step: evaluation.
   */
  skipEval?: boolean;

  /**
   * Boolean flags to trigger certain UI elements in the bundler
   */
  showOpenInCodeSandbox?: boolean;
  showErrorScreen?: boolean;
  showLoadingScreen?: boolean;

  /**
   * You can pass a custom file resolver that is responsible for resolving files.
   * We will use this to get all files from the file system.
   */
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };
}

export interface IFile {
  code: string;
}

export interface IFiles {
  [path: string]: IFile;
}

export interface IModules {
  [path: string]: {
    code: string;
    path: string;
  };
}

export interface IDependencies {
  [depName: string]: string;
}

export interface ISandboxInfo {
  files: IFiles;
  dependencies?: IDependencies;
  entry?: string;
  /**
   * What template we use, if not defined we infer the template from the dependencies or files.
   *
   * @type {string}
   */
  template?: string;

  /**
   * Only use unpkg for fetching the dependencies, no preprocessing. It's slower, but doesn't talk
   * to AWS.
   */
  disableDependencyPreprocessing?: boolean;
}

const BUNDLER_URL =
  process.env.CODESANDBOX_ENV === 'development'
    ? 'http://localhost:3000'
    : `https://${version.replace(/\./g, '-')}-sandpack.codesandbox.io`;

export default class PreviewManager {
  selector: string | undefined;
  element: Element;
  iframe: HTMLIFrameElement;
  options: IManagerOptions;
  readonly id: number = Math.floor(Math.random() * 1000000);

  listener?: Function;
  fileResolverProtocol?: Protocol;
  bundlerURL: string;
  managerState: IManagerState | undefined;
  errors: Array<IModuleError>;
  status: ManagerStatus;

  sandboxInfo: ISandboxInfo;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: ISandboxInfo,
    options: IManagerOptions = {}
  ) {
    this.options = options;
    this.sandboxInfo = sandboxInfo;
    this.bundlerURL = options.bundlerURL || BUNDLER_URL;
    this.managerState = undefined;
    this.errors = [];
    this.status = 'initializing';

    if (typeof selector === 'string') {
      this.selector = selector;
      const element = document.querySelector(selector);

      if (!element) {
        throw new Error(`No element found for selector '${selector}'`);
      }

      this.element = element;
      this.iframe = document.createElement('iframe');
      this.initializeElement();
    } else {
      this.element = selector;
      this.iframe = selector;
    }
    if (!this.iframe.getAttribute('sandbox')) {
      this.iframe.setAttribute(
        'sandbox',
        'allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts'
      );
    }
    if (!this.iframe.getAttribute('allow')) {
      this.iframe.setAttribute(
        'allow',
        'accelerometer; ambient-light-sensor; autoplay; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking'
      );
    }

    this.iframe.src = this.bundlerURL;
    this.listener = listen((mes: any) => {
      if (mes.type !== 'initialized' && mes.$id && mes.$id !== this.id) {
        // This message was not meant for this instance of the manager.
        return;
      }

      switch (mes.type) {
        case 'initialized': {
          if (this.iframe) {
            if (this.iframe.contentWindow) {
              registerFrame(
                this.iframe.contentWindow,
                this.bundlerURL,
                this.id
              );

              if (this.options.fileResolver) {
                this.fileResolverProtocol = new Protocol(
                  'file-resolver',
                  async (data: { m: 'isFile' | 'readFile'; p: string }) => {
                    if (data.m === 'isFile') {
                      return this.options.fileResolver!.isFile(data.p);
                    }

                    return this.options.fileResolver!.readFile(data.p);
                  },
                  this.iframe.contentWindow
                );
              }
            }

            this.updatePreview(this.sandboxInfo, true);
          }
          break;
        }
        case 'start': {
          this.errors = [];
          break;
        }
        case 'status': {
          this.status = mes.status;
          break;
        }
        case 'action': {
          if (mes.action === 'show-error') {
            const { title, path, message, line, column } = mes;
            this.errors = [
              ...this.errors,
              { title, path, message, line, column },
            ];
          }
          break;
        }
        case 'state': {
          this.managerState = mes.state;
          break;
        }
        default: {
          // Do nothing
        }
      }
    });
  }

  updateOptions(options: IManagerOptions) {
    if (!isEqual(this.options, options)) {
      this.options = options;
      this.updatePreview();
    }
  }

  updatePreview(
    sandboxInfo = this.sandboxInfo,
    isInitializationCompile?: boolean
  ) {
    this.sandboxInfo = sandboxInfo;

    const files = this.getFiles();

    const modules: IModules = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next]: {
          code: files[next].code,
          path: next,
        },
      }),
      {}
    );

    let packageJSON = JSON.parse(
      getPackageJSON(this.sandboxInfo.dependencies, this.sandboxInfo.entry)
    );
    try {
      packageJSON = JSON.parse(files['/package.json'].code);
    } catch (e) {
      console.error('Could not parse package.json file: ' + e.message);
    }

    // TODO move this to a common format
    const normalizedModules = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next]: {
          content: files[next].code,
          path: next,
        },
      }),
      {}
    );

    this.dispatch({
      type: 'compile',
      codesandbox: true,
      version: 3,
      isInitializationCompile,
      modules,
      externalResources: [],
      hasFileResolver: Boolean(this.options.fileResolver),
      disableDependencyPreprocessing: this.sandboxInfo
        .disableDependencyPreprocessing,
      template:
        this.sandboxInfo.template ||
        getTemplate(packageJSON, normalizedModules),
      showOpenInCodeSandbox: this.options.showOpenInCodeSandbox ?? true,
      showErrorScreen: this.options.showErrorScreen ?? true,
      showLoadingScreen: this.options.showLoadingScreen ?? true,
      skipEval: this.options.skipEval || false,
    });
  }

  public dispatch(message: Object) {
    // @ts-ignore We want to add the id, don't use Object.assign since that copies the message.
    message.$id = this.id;
    dispatch(message);
  }

  public listen(listener: (msg: any) => void): Function {
    return listen((msg: any) => {
      if (msg.$id !== this.id) {
        return;
      }

      listener(msg);
    });
  }

  /**
   * Get the URL of the contents of the current sandbox
   */
  public getCodeSandboxURL() {
    const files = this.getFiles();

    const paramFiles = Object.keys(files).reduce(
      (prev, next) => ({
        ...prev,
        [next.replace('/', '')]: {
          content: files[next].code,
          isBinary: false,
        },
      }),
      {}
    );

    return fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
      method: 'POST',
      body: JSON.stringify({ files: paramFiles }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(x => x.json())
      .then((res: { sandbox_id: string }) => ({
        sandboxId: res.sandbox_id,
        editorUrl: `https://codesandbox.io/s/${res.sandbox_id}`,
        embedUrl: `https://codesandbox.io/embed/${res.sandbox_id}`,
      }));
  }

  public getManagerTranspilerContext = (): Promise<{
    [transpiler: string]: Object;
  }> =>
    new Promise(resolve => {
      const listener = this.listen((message: any) => {
        if (message.type === 'transpiler-context') {
          resolve(message.data);

          listener();
        }
      });

      this.dispatch({ type: 'get-transpiler-context' });
    });

  private getFiles() {
    const { sandboxInfo } = this;

    if (sandboxInfo.files['/package.json'] === undefined) {
      return generatePackageJSON(
        sandboxInfo.files,
        sandboxInfo.dependencies,
        sandboxInfo.entry
      );
    }

    return this.sandboxInfo.files;
  }

  private initializeElement() {
    this.iframe.style.border = '0';
    this.iframe.style.width = this.options.width || '100%';
    this.iframe.style.height = this.options.height || '100%';
    this.iframe.style.overflow = 'hidden';

    if (!this.element.parentNode) {
      // This should never happen
      throw new Error('Given element does not have a parent.');
    }

    this.element.parentNode.replaceChild(this.iframe, this.element);
  }
}
