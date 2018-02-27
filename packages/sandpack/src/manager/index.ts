import { dispatch, registerFrame } from 'codesandbox-api';

export interface IManagerOptions {
  sandboxUrl?: string;
  width?: string;
  height?: string;
  template?: string;
}

export interface ISandboxInfo {
  files: IFiles;
  dependencies: IDependencies;
  entry: string;
}

export interface IFiles {
  [path: string]: {
    code: string;
  };
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

export default class PreviewManager {
  selector: string | undefined;
  element: Element;
  iframe: HTMLIFrameElement;
  options: IManagerOptions;

  constructor(
    selector: string | HTMLIFrameElement,
    sandboxInfo: ISandboxInfo,
    options: IManagerOptions = {}
  ) {
    let element = null;
    if (typeof selector === 'string') {
      this.selector = selector;
      element = document.querySelector(selector);
    } else {
      element = selector;
    }

    if (!element) {
      throw new Error(`No element found for selector '${selector}'`);
    }

    this.element = element;
    this.iframe = document.createElement('iframe');

    this.options = options;
    this.initializeElement();

    registerFrame(this.iframe.contentWindow);

    this.sendCode(
      sandboxInfo.files,
      sandboxInfo.dependencies,
      sandboxInfo.entry
    );
  }

  sendCode(files: IFiles, dependencies: IDependencies, entry: string) {
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

    modules['/package.json'] = {
      code: JSON.stringify(
        {
          name: 'run',
          main: entry,
          dependencies,
        },
        null,
        2
      ),
      path: '/package.json',
    };

    dispatch({
      type: 'compile',
      codesandbox: true,
      version: 3,
      modules,
      entry: entry,
      dependencies: dependencies,
      externalResources: [],
      template: this.options.template || 'create-react-app',
      showOpenInCodeSandbox: true,
    });
  }

  private initializeElement() {
    this.iframe.src =
      this.options.sandboxUrl || 'https://sandbox.codesandbox.io';
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
