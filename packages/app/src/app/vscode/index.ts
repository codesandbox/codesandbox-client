import bootstrap from './dev-bootstrap';

interface IServiceCache {
  [serviceName: string]: any;
}

/**
 * Responsible for rendering React components for files that are supported
 */
interface ICustomEditorApi {
  getCustomEditorAPI(
    modulePath: string
  ): false | ((container: HTMLElement, extraProps: object) => void);
}

const context: any = window;

/**
 * Handles the VSCode instance for the whole app. The goal is to deprecate/remove this service at one point
 * and let the VSCode codebase handle the initialization of all elements. We are going for a gradual approach though,
 * that's why in the first phase we let the CodeSandbox application handle all the initialization of the VSCode
 * parts.
 */
class VSCodeManager {
  private serviceCache: IServiceCache;
  private controller: any;
  private createMenubar: () => void;

  private statusbarPart: any;
  private statusbarPartPromise: {
    resolve?: (statusbarPart: any) => void;
    promise?: Promise<any>;
  } = {};

  private menubarPart: any;
  private menubarPartPromise: {
    resolve?: (statusbarPart: any) => void;
    promise?: Promise<any>;
  } = {};

  public acquireController(controller: any) {
    this.controller = controller;
  }

  public acquireMenuBarComponent(createMenuBar: () => void) {
    this.createMenubar = createMenuBar;
  }

  public loadScript(scripts: string[], cb: () => void) {
    bootstrap(scripts, true)(cb);
  }

  /**
   * Initialize the base VSCode editor, this includes registering all the services in VSCode.
   */
  public initializeEditor(
    container: HTMLElement,
    customEditorAPI: ICustomEditorApi,
    cb: (services: IServiceCache) => void
  ) {
    if (this.serviceCache) {
      cb(this.serviceCache);
      return;
    }

    const [
      { CodeSandboxService },
      { CodeSandboxConfigurationUIService },
      { IStatusbarService },
    ] = [
      context.require(
        'vs/codesandbox/services/codesandbox/browser/codesandboxService'
      ),
      context.require(
        'vs/codesandbox/services/codesandbox/configurationUIService'
      ),
      context.require('vs/platform/statusbar/common/statusbar'),
    ];

    context.monaco.editor.create(
      container,
      {
        codesandboxService: i =>
          i.createInstance(CodeSandboxService, this.controller),
        codesandboxConfigurationUIService: i =>
          i.createInstance(CodeSandboxConfigurationUIService, customEditorAPI),
      },
      returnedServices => {
        this.serviceCache = returnedServices;

        // Initialize status bar
        this.statusbarPart = returnedServices.get(IStatusbarService);
        if (this.statusbarPartPromise.resolve) {
          this.statusbarPartPromise.resolve(this.statusbarPart);
        }

        // Initialize menu bar
        this.menubarPart = returnedServices.get('menubar');
        if (this.menubarPartPromise.resolve) {
          this.menubarPartPromise.resolve(this.menubarPart);
        }

        cb(this.serviceCache);
      }
    );
  }

  public createSearchView() {}

  public getStatusbarPart() {
    if (this.statusbarPart) {
      return Promise.resolve(this.statusbarPart);
    }

    if (this.statusbarPartPromise.promise) {
      return this.statusbarPartPromise.promise;
    }

    this.statusbarPartPromise.promise = new Promise(resolve => {
      this.statusbarPartPromise.resolve = resolve;
    });

    return this.statusbarPartPromise.promise;
  }

  public getMenubarPart() {
    if (this.menubarPart) {
      return Promise.resolve(this.menubarPart);
    }

    if (this.menubarPartPromise.promise) {
      return this.menubarPartPromise.promise;
    }

    this.menubarPartPromise.promise = new Promise(resolve => {
      this.menubarPartPromise.resolve = resolve;
    });

    return this.menubarPartPromise.promise;
  }
}

export default new VSCodeManager();
