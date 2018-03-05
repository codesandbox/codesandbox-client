import { dispatch, listen, registerFrame } from 'codesandbox-api';

export interface IManagerOptions {
  sandboxUrl?: string;
  width?: string;
  height?: string;
  template?: string;
  skipEval?: boolean;
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
  listener?: Function;
  skipEval: boolean;

  files: IFiles;

  constructor(
    selector: string | HTMLIFrameElement,
    files: IFiles,
    options: IManagerOptions = {}
  ) {
    this.options = options;
    this.files = files;

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

    this.skipEval = options.skipEval || false;

    this.listener = listen((message: any) => {
      switch (message.type) {
        case 'initialized': {
          if (this.iframe) {
            registerFrame(this.iframe.contentWindow);

            this.sendCode(this.files);
          }
          break;
        }
        default: {
          // Do nothing
        }
      }
    });
  }

  sendCode(files: IFiles) {
    this.files = files;

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

    dispatch({
      type: 'compile',
      codesandbox: true,
      version: 3,
      modules,
      externalResources: [],
      template: this.options.template || 'create-react-app',
      showOpenInCodeSandbox: true,
      skipEval: this.skipEval,
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
