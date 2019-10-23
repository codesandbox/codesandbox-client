import {
  convertTypeToStatus,
  notificationState,
} from '@codesandbox/common/lib/utils/notifications';
import { NotificationMessage } from '@codesandbox/notifications/lib/state';
import { Blocker, blocker } from 'app/utils/blocker';

import bootstrap from './dev-bootstrap';
import {
  initializeCustomTheme,
  initializeExtensionsFolder,
  initializeSettings,
  initializeThemeCache,
} from './initializers';
import { KeyCode, KeyMod } from './keyCodes';
import { MenuId } from './menus';

interface IServiceCache {
  [serviceName: string]: any;
}

/**
 * Responsible for rendering React components for files that are supported
 */
export interface ICustomEditorApi {
  getCustomEditor(
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
export class VSCodeManager {
  // We should not need this as we load VSCode at effects level
  // private serviceCache: IServiceCache;
  private controller: any;
  private editor: Blocker<any>;
  private commandService = blocker<any>();
  private extensionService = blocker<any>();
  private extensionEnablementService = blocker<any>();
  private getCustomEditor: ICustomEditorApi['getCustomEditor'];

  constructor(
    controller: any,
    getCustomEditor: ICustomEditorApi['getCustomEditor']
  ) {
    this.controller = controller;
    this.getCustomEditor = getCustomEditor;
  }

  public loadScript(scripts: string[]) {
    return new Promise(resolve => {
      bootstrap(true, scripts)(resolve);
    });
  }

  private addWorkbenchActions() {
    this.addWorkbenchAction({
      id: 'workbench.action.toggleStatusbarVisibility',
      label: 'Toggle Status Bar Visibility',
      commandLabel: 'Toggle Status Bar Visibility',
      category: 'View',
      run: () => {
        this.controller.getSignal('editor.toggleStatusBar')();
      },
    });
    this.addWorkbenchAction({
      id: 'view.preview.flip',
      label: 'Flip Preview Layout',
      commandLabel: 'Toggle Vertical/Horizontal Preview Layout',
      category: 'View',
      run: () => {
        this.runCommand('workbench.action.toggleEditorGroupLayout');
        this.controller.getSignal('editor.toggleEditorPreviewLayout')();
      },
      keybindings: {
        primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KEY_9,
        mac: {
          primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KEY_9,
        },
      },
    });

    this.addWorkbenchAction({
      id: 'codesandbox.sandbox.new',
      label: 'New Sandbox...',
      category: 'Sandbox',
      run: () => {
        this.controller.getSignal('modalOpened')({ modal: 'newSandbox' });
      },
    });

    this.addWorkbenchAction({
      id: 'codesandbox.sandbox.fork',
      label: 'Fork Sandbox',
      category: 'Sandbox',
      run: () => {
        this.controller.getSignal('editor.forkSandboxClicked')();
      },
    });

    this.addWorkbenchAction({
      id: 'codesandbox.sandbox.exportzip',
      label: 'Export To ZIP',
      category: 'Sandbox',
      run: () => {
        this.controller.getSignal('editor.createZipClicked')();
      },
    });

    this.addWorkbenchAction({
      id: 'codesandbox.preferences',
      label: 'Open CodeSandbox Settings',
      category: 'Preferences',
      run: () => {
        this.controller.getSignal('modalOpened')({ modal: 'preferences' });
      },
    });

    this.appendMenuItem(MenuId.MenubarFileMenu, {
      group: '1_new',
      order: 1,
      command: {
        id: 'codesandbox.sandbox.new',
        title: 'New Sandbox...',
      },
    });

    this.appendMenuItem(MenuId.MenubarFileMenu, {
      // Z to be the last item after vscode group 4
      group: '4_zsandbox',
      order: 1,
      command: {
        id: 'codesandbox.sandbox.fork',
        title: '&&Fork Sandbox',
      },
    });

    this.appendMenuItem(MenuId.MenubarFileMenu, {
      group: '4_zsandbox',
      order: 2,
      command: {
        id: 'codesandbox.sandbox.exportzip',
        title: 'Export to ZIP',
      },
    });

    this.appendMenuItem(MenuId.MenubarPreferencesMenu, {
      group: '1_settings',
      order: 1,
      command: {
        id: 'codesandbox.preferences',
        title: 'CodeSandbox Settings',
      },
    });

    this.appendMenuItem(MenuId.MenubarLayoutMenu, {
      group: 'z_flip',
      command: {
        id: 'view.preview.flip',
        title: 'Flip Full Layout',
      },
      order: 2,
    });

    const addBrowserNavigationCommand = (
      id: string,
      label: string,
      url: string
    ) => {
      this.addWorkbenchAction({
        id,
        label,
        category: 'Help',
        run: () => {
          window.open(url, '_blank');
        },
      });
    };

    addBrowserNavigationCommand(
      'codesandbox.help.documentation',
      'Documentation',
      'https://codesandbox.io/docs'
    );
    addBrowserNavigationCommand(
      'codesandbox.explore',
      'Explore Sandboxes',
      'https://codesandbox.io/explore'
    );
    addBrowserNavigationCommand(
      'codesandbox.search',
      'Search',
      'https://codesandbox.io/search'
    );
    addBrowserNavigationCommand(
      'codesandbox.dashboard',
      'Dashboard',
      'https://codesandbox.io/dashboard'
    );
    addBrowserNavigationCommand(
      'codesandbox.help.open-issue',
      'Open Issue on GitHub',
      'https://github.com/codesandbox/codesandbox-client/issues'
    );
    addBrowserNavigationCommand(
      'codesandbox.help.github',
      'Open Our GitHub Repository',
      'https://github.com/codesandbox/codesandbox-client'
    );
    addBrowserNavigationCommand(
      'codesandbox.help.twitter',
      'Follow Us on Twitter',
      'https://twitter.com/codesandbox'
    );
    addBrowserNavigationCommand(
      'codesandbox.help.spectrum',
      'Join Us on Spectrum',
      'https://spectrum.chat/codesandbox'
    );

    this.addWorkbenchAction({
      id: 'codesandbox.help.feedback',
      label: 'Submit Feedback...',
      category: 'Help',
      run: () => {
        this.controller.getSignal('modalOpened')({ modal: 'feedback' });
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '1_resources',
      order: 1,
      command: {
        id: 'codesandbox.help.documentation',
        title: '&&Documentation',
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '1_resources',
      order: 2,
      command: {
        id: 'codesandbox.explore',
        title: '&&Explore Sandboxes',
      },
    });
    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '1_resources',
      order: 3,
      command: {
        id: 'codesandbox.search',
        title: '&&Search',
      },
    });
    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '1_resources',
      order: 4,
      command: {
        id: 'codesandbox.dashboard',
        title: 'D&&ashboard',
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '2_help',
      order: 1,
      command: {
        id: 'codesandbox.help.open-issue',
        title: '&&Open Issue on GitHub',
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '2_help',
      order: 2,
      command: {
        id: 'codesandbox.help.feedback',
        title: 'Submit &&Feedback...',
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '3_social',
      order: 1,
      command: {
        id: 'codesandbox.help.github',
        title: '&&GitHub Repository',
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '3_social',
      order: 2,
      command: {
        id: 'codesandbox.help.twitter',
        title: 'Follow Us on &&Twitter',
      },
    });

    this.appendMenuItem(MenuId.MenubarHelpMenu, {
      group: '3_social',
      order: 3,
      command: {
        id: 'codesandbox.help.spectrum',
        title: 'Join Us on S&&pectrum',
      },
    });
  }

  addNotification(
    message: string,
    type: 'warning' | 'notice' | 'error' | 'success',
    notification: NotificationMessage
  ) {
    notificationState.addNotification({
      message,
      status: convertTypeToStatus(type),
      ...notification,
    });
  }

  public async loadEditor(
    container: HTMLElement,
    cb: (result: {
      monaco: any;
      statusbarPart: any;
      menubarPart: any;
      editorPart: any;
      editorApi: any;
    }) => any
  ) {
    if (!this.editor) {
      this.editor = blocker();

      // For first-timers initialize a theme in the cache so it doesn't jump colors
      initializeExtensionsFolder();
      initializeCustomTheme();
      initializeThemeCache();
      initializeSettings();

      if (localStorage.getItem('settings.vimmode') === 'true') {
        this.enableExtension('vscodevim.vim');
      }

      this.addWorkbenchActions();

      const r = window.require;
      const [
        { IEditorService },
        { ICodeEditorService },
        { ITextFileService },
        { ILifecycleService },
        { IEditorGroupsService },
        { IStatusbarService },
        { IExtensionService },
        { IContextViewService },
        { IQuickOpenService },
        { CodeSandboxService },
        { CodeSandboxConfigurationUIService },
        { ICodeSandboxEditorConnectorService },
        { ICommandService },
        { SyncDescriptor },
        { IInstantiationService },
        { IExtensionEnablementService },
      ] = [
        r('vs/workbench/services/editor/common/editorService'),
        r('vs/editor/browser/services/codeEditorService'),
        r('vs/workbench/services/textfile/common/textfiles'),
        r('vs/platform/lifecycle/common/lifecycle'),
        r('vs/workbench/services/editor/common/editorGroupsService'),
        r('vs/platform/statusbar/common/statusbar'),
        r('vs/workbench/services/extensions/common/extensions'),
        r('vs/platform/contextview/browser/contextView'),
        r('vs/platform/quickOpen/common/quickOpen'),
        r('vs/codesandbox/services/codesandbox/browser/codesandboxService'),
        r('vs/codesandbox/services/codesandbox/configurationUIService'),
        r(
          'vs/codesandbox/services/codesandbox/common/codesandboxEditorConnector'
        ),
        r('vs/platform/commands/common/commands'),
        r('vs/platform/instantiation/common/descriptors'),
        r('vs/platform/instantiation/common/instantiation'),
        r('vs/platform/extensionManagement/common/extensionManagement'),
      ];

      const monacoCreateStart = performance.now();
      const { serviceCollection } = await new Promise<any>(resolve => {
        window.monaco.editor.create(
          container,
          {
            codesandboxService: i =>
              new SyncDescriptor(CodeSandboxService, [this.controller, this]),
            codesandboxConfigurationUIService: i =>
              new SyncDescriptor(CodeSandboxConfigurationUIService, [
                { getCustomEditor: this.getCustomEditor },
              ]),
          },
          resolve
        );
      });
      console.log('MONACO CREATE', performance.now() - monacoCreateStart);

      // It has to run the accessor within the callback
      serviceCollection.get(IInstantiationService).invokeFunction(accessor => {
        // Initialize these services
        accessor.get(CodeSandboxConfigurationUIService);
        accessor.get(ICodeSandboxEditorConnectorService);

        const statusbarPart = accessor.get(IStatusbarService);
        const menubarPart = accessor.get('menubar');
        const commandService = accessor.get(ICommandService);
        const extensionService = accessor.get(IExtensionService);
        const extensionEnablementService = accessor.get(
          IExtensionEnablementService
        );

        this.commandService.resolve(commandService);
        this.extensionService.resolve(extensionService);
        this.extensionEnablementService.resolve(extensionEnablementService);

        const editorPart = accessor.get(IEditorGroupsService);

        const codeEditorService = accessor.get(ICodeEditorService);
        const textFileService = accessor.get(ITextFileService);
        const editorService = accessor.get(IEditorService);

        /*
      this.lifecycleService = accessor.get(ILifecycleService);
      this.quickopenService = accessor.get(IQuickOpenService);

      if (this.lifecycleService.phase !== 3) {
        this.lifecycleService.phase = 2; // Restoring
        requestAnimationFrame(() => {
          this.lifecycleService.phase = 3; // Running
        });
      } else {
        // It seems like the VSCode instance has been started before
        const extensionService = accessor.get(IExtensionService);
        const contextViewService = accessor.get(IContextViewService);

        // It was killed in the last quit
        extensionService.startExtensionHost();
        contextViewService.setContainer(el);

        // We force this to recreate, otherwise it's bound to an element that's disposed
        this.quickopenService.quickOpenWidget = undefined;
      }
      */

        const editorApi = {
          openFile(path) {
            codeEditorService.openCodeEditor({
              resource: window.monaco.Uri.file('/sandbox' + path),
            });
          },
          getActiveCodeEditor() {
            return codeEditorService.getActiveCodeEditor();
          },
          textFileService,
          editorPart,
          editorService,
          codeEditorService,
        };

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line
          console.log(accessor);
        }

        this.editor.resolve(
          cb({
            monaco: window.monaco,
            statusbarPart,
            menubarPart,
            editorPart,
            editorApi,
          })
        );
      });
    }

    return this.editor.promise;
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

  public appendMenuItem(
    menubarId: number,
    item: {
      group: string;
      command: {
        id: string;
        title: string;
        toggled?: boolean;
      };
      order: number;
    }
  ) {
    context.monaco.editor.appendMenuItem(menubarId, item);
  }

  public addWorkbenchAction({
    id,
    label,
    commandLabel = label,
    category = 'CodeSandbox',
    run,
    keybindings = { primary: 0 },
  }: {
    id: string;
    label: string;
    commandLabel?: string; // Name of the command
    category?: string;
    run: () => any | Promise<any>;
    keybindings?: { primary: number; mac?: { primary: number } };
  }) {
    context.monaco.editor.addWorkbenchActions({
      id,
      label,
      commandLabel,
      run,
      category,
      keybindings,
    });
  }

  public async disableExtension(id: string) {
    const extensionService = await this.extensionService.promise;
    const extensionEnablementService = await this.extensionEnablementService
      .promise;

    const extensionDescription = await extensionService.getExtension(id);

    if (extensionDescription) {
      const { toExtension } = context.require(
        'vs/workbench/services/extensions/common/extensions'
      );
      const extension = toExtension(extensionDescription);
      extensionEnablementService.setEnablement([extension], 0);
    }
  }

  public async enableExtension(id: string) {
    const extensionEnablementService = await this.extensionEnablementService
      .promise;
    const extensionIdentifier = (await extensionEnablementService.getDisabledExtensions()).find(
      ext => ext.id === id
    );

    if (extensionIdentifier) {
      // Sadly we have to call a private api for this. Might change this once we have extension management
      // built in.
      extensionEnablementService._enableExtension(extensionIdentifier);
    }
  }
}
