import { dispatch, listen, registerFrame, Protocol } from 'codesandbox-api';
import { getTemplate } from 'codesandbox-import-utils/lib/create-sandbox/templates';

import isEqual from 'lodash.isequal';

import generatePackageJSON, {
  getPackageJSON,
} from '../utils/generate-package-json';
import version from '../version';

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

  showOpenInCodeSandbox?: boolean;

  /**
   * Only use unpkg for fetching the dependencies, no preprocessing. It's slower, but doesn't talk
   * to AWS.
   */
  disableDependencyPreprocessing?: boolean;
}

const BUNDLER_URL =
  process.env.CODESANDBOX_ENV === 'development'
    ? 'http://localhost:3001'
    : `https://sandpack-${version.replace(/\./g, '-')}.codesandbox.io`;

export default class PreviewManager {
  selector: string | undefined;
  element: Element;
  iframe: HTMLIFrameElement;
  options: IManagerOptions;
  listener?: Function;
  fileResolverProtocol?: Protocol;
  bundlerURL: string;

  sandboxInfo: ISandboxInfo;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: ISandboxInfo,
    options: IManagerOptions = {}
  ) {
    this.options = options;
    this.sandboxInfo = sandboxInfo;
    this.bundlerURL = options.bundlerURL || BUNDLER_URL;

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
    this.iframe.src = this.bundlerURL;

    this.listener = listen((message: any) => {
      switch (message.type) {
        case 'initialized': {
          if (this.iframe) {
            if (this.iframe.contentWindow) {
              registerFrame(this.iframe.contentWindow, BUNDLER_URL);

              if (this.options.fileResolver) {
                this.fileResolverProtocol = new Protocol(
                  'file-resolver',
                  async (data: { m: 'isFile' | 'readFile'; p: string }) => {
                    if (data.m === 'isFile') {
                      return this.options.fileResolver!.isFile(data.p);
                    } else {
                      return this.options.fileResolver!.readFile(data.p);
                    }
                  },
                  this.iframe.contentWindow
                );
              }
            }

            this.updatePreview();
          }
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

  updatePreview(sandboxInfo = this.sandboxInfo) {
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

    dispatch({
      type: 'compile',
      codesandbox: true,
      version: 3,
      modules,
      externalResources: [],
      hasFileResolver: !!this.options.fileResolver,
      disableDependencyPreprocessing: this.sandboxInfo
        .disableDependencyPreprocessing,
      template:
        this.sandboxInfo.template ||
        getTemplate(packageJSON, normalizedModules),
      showOpenInCodeSandbox:
        this.sandboxInfo.showOpenInCodeSandbox == null
          ? true
          : this.sandboxInfo.showOpenInCodeSandbox,
      skipEval: this.options.skipEval || false,
    });
  }

  public dispatch(message: Object) {
    dispatch(message);
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
