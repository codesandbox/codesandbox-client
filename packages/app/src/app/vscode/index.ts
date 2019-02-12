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

  public setController(controller: any) {
    this.controller = controller;
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

    const [{ CodeSandboxService }, { CodeSandboxConfigurationUIService }] = [
      context.require(
        'vs/codesandbox/services/codesandbox/browser/codesandboxService'
      ),
      context.require(
        'vs/codesandbox/services/codesandbox/configurationUIService'
      ),
    ];

    context.monaco.editor.create(
      container,
      {},
      {
        codesandboxService: i =>
          i.createInstance(CodeSandboxService, this.controller),
        codesandboxConfigurationUIService: i =>
          i.createInstance(CodeSandboxConfigurationUIService, customEditorAPI),
      },
      returnedServices => {
        this.serviceCache = returnedServices;
        cb(this.serviceCache);
      }
    );
  }

  public createSearchView() {}
}

export default new VSCodeManager();
