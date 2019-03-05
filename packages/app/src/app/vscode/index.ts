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
 * This is a waiting promise that only resolves when VSCode is done initializing
 */
function blocker() {
  let resolve = null;
  const promise = new Promise(r => {
    resolve = r;
  });

  return {
    promise,
    resolve,
  };
}

/**
 * Handles the VSCode instance for the whole app. The goal is to deprecate/remove this service at one point
 * and let the VSCode codebase handle the initialization of all elements. We are going for a gradual approach though,
 * that's why in the first phase we let the CodeSandbox application handle all the initialization of the VSCode
 * parts.
 */
class VSCodeManager {
  private serviceCache: IServiceCache;
  private controller: any;

  private statusbarPart = blocker();
  private menubarPart = blocker();
  private commandService = blocker();

  private keyCodes;

  public acquireController(controller: any) {
    this.controller = controller;
    this.keyCodes = context.require('vs/base/common/keyCodes');
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

    this.addWorkbenchAction({
      id: 'codesandbox.test',
      label: 'Test Command',
      category: 'Puk',
      run: () => {
        alert('HELLO!');
      },
      keybindings: {
        primary: this.keyCodes.KeyMod.Shift | this.keyCodes.KeyCode.KEY_C,
      },
    });

    const [
      { CodeSandboxService },
      { CodeSandboxConfigurationUIService },
      { IStatusbarService },
      { ICommandService },
    ] = [
      context.require(
        'vs/codesandbox/services/codesandbox/browser/codesandboxService'
      ),
      context.require(
        'vs/codesandbox/services/codesandbox/configurationUIService'
      ),
      context.require('vs/platform/statusbar/common/statusbar'),
      context.require('vs/platform/commands/common/commands'),
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
        const statusbarPart = returnedServices.get(IStatusbarService);
        this.statusbarPart.resolve(statusbarPart);

        // Initialize menu bar
        const menubarPart = returnedServices.get('menubar');
        this.menubarPart.resolve(menubarPart);

        // Initialize command service
        const commandService = returnedServices.get(ICommandService);
        this.commandService.resolve(commandService);

        cb(this.serviceCache);
      }
    );
  }

  public async getStatusbarPart(): Promise<any> {
    return this.statusbarPart.promise;
  }

  public async getMenubarPart(): Promise<any> {
    return this.menubarPart.promise;
  }

  public async getCommandService(): Promise<any> {
    return this.commandService.promise;
  }

  /**
   * Run a command registered in VSCode
   *
   * @param id VSCode ID of the command
   * @param args Extra arguments
   */
  public async runCommand(id: string, ...args: any[]) {
    const commandService = await this.getCommandService();

    return commandService.executeCommand(id, ...args);
  }

  public addWorkbenchAction({
    id,
    label,
    category = 'CodeSandbox',
    run,
    keybindings = { primary: 0 },
  }: {
    id: string;
    label: string;
    category?: string;
    run: () => any | Promise<any>;
    keybindings?: { primary: number };
  }) {
    context.monaco.editor.addWorkbenchActions({
      id,
      label,
      run,
      category,
      keybindings,
    });
  }

  public createMenubarMenu() {}
}

export default new VSCodeManager();
