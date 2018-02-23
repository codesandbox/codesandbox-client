import { IFiles, IDependencies, sendCode } from '../utils/frame';

export interface IManagerOptions {
  sandboxUrl?: string;
  width?: string;
  height?: string;
}

export interface ISandboxInfo {
  files: IFiles;
  dependencies: IDependencies;
  entry: string;
}

export default class PreviewManager {
  selector: string;
  element: Element;
  iframe: HTMLIFrameElement;
  options: IManagerOptions;

  constructor(
    selector: string,
    sandboxInfo: ISandboxInfo,
    options: IManagerOptions = {}
  ) {
    this.selector = selector;
    const element = document.querySelector(selector);

    if (!element) {
      throw new Error(`No element found for selector '${selector}'`);
    }

    this.element = element;
    this.iframe = document.createElement('iframe');

    this.options = options;
    this.initializeElement();

    this.sendCode(
      sandboxInfo.files,
      sandboxInfo.dependencies,
      sandboxInfo.entry
    );
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

  sendCode(files: IFiles, dependencies: IDependencies, entry: string) {
    sendCode(this.iframe, files, dependencies, entry);
  }
}
