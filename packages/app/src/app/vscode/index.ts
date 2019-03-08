import bootstrap from './dev-bootstrap';

interface IServiceCache {
  [serviceName: string]: any;
}

type KeyMap = {
  KeyMod: {
    CtrlCmd: number;
    Shift: number;
    Alt: number;
    WinCtrl: number;
  };
  KeyCode: {
    /**
     * Placed first to cover the 0 value of the enum.
     */
    Unknown: 0;

    Backspace: 1;
    Tab: 2;
    Enter: 3;
    Shift: 4;
    Ctrl: 5;
    Alt: 6;
    PauseBreak: 7;
    CapsLock: 8;
    Escape: 9;
    Space: 10;
    PageUp: 11;
    PageDown: 12;
    End: 13;
    Home: 14;
    LeftArrow: 15;
    UpArrow: 16;
    RightArrow: 17;
    DownArrow: 18;
    Insert: 19;
    Delete: 20;

    KEY_0: 21;
    KEY_1: 22;
    KEY_2: 23;
    KEY_3: 24;
    KEY_4: 25;
    KEY_5: 26;
    KEY_6: 27;
    KEY_7: 28;
    KEY_8: 29;
    KEY_9: 30;

    KEY_A: 31;
    KEY_B: 32;
    KEY_C: 33;
    KEY_D: 34;
    KEY_E: 35;
    KEY_F: 36;
    KEY_G: 37;
    KEY_H: 38;
    KEY_I: 39;
    KEY_J: 40;
    KEY_K: 41;
    KEY_L: 42;
    KEY_M: 43;
    KEY_N: 44;
    KEY_O: 45;
    KEY_P: 46;
    KEY_Q: 47;
    KEY_R: 48;
    KEY_S: 49;
    KEY_T: 50;
    KEY_U: 51;
    KEY_V: 52;
    KEY_W: 53;
    KEY_X: 54;
    KEY_Y: 55;
    KEY_Z: 56;

    Meta: 57;
    ContextMenu: 58;

    F1: 59;
    F2: 60;
    F3: 61;
    F4: 62;
    F5: 63;
    F6: 64;
    F7: 65;
    F8: 66;
    F9: 67;
    F10: 68;
    F11: 69;
    F12: 70;
    F13: 71;
    F14: 72;
    F15: 73;
    F16: 74;
    F17: 75;
    F18: 76;
    F19: 77;

    NumLock: 78;
    ScrollLock: 79;

    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ';:' key
     */
    US_SEMICOLON: 80;
    /**
     * For any country/region, the '+' key
     * For the US standard keyboard, the '=+' key
     */
    US_EQUAL: 81;
    /**
     * For any country/region, the ',' key
     * For the US standard keyboard, the ',<' key
     */
    US_COMMA: 82;
    /**
     * For any country/region, the '-' key
     * For the US standard keyboard, the '-_' key
     */
    US_MINUS: 83;
    /**
     * For any country/region, the '.' key
     * For the US standard keyboard, the '.>' key
     */
    US_DOT: 84;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '/?' key
     */
    US_SLASH: 85;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '`~' key
     */
    US_BACKTICK: 86;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '[{' key
     */
    US_OPEN_SQUARE_BRACKET: 87;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the '\|' key
     */
    US_BACKSLASH: 88;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ']}' key
     */
    US_CLOSE_SQUARE_BRACKET: 89;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     * For the US standard keyboard, the ''"' key
     */
    US_QUOTE: 90;
    /**
     * Used for miscellaneous characters; it can vary by keyboard.
     */
    OEM_8: 91;
    /**
     * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
     */
    OEM_102: 92;

    NUMPAD_0: 93; // VK_NUMPAD0, 0x60, Numeric keypad 0 key
    NUMPAD_1: 94; // VK_NUMPAD1, 0x61, Numeric keypad 1 key
    NUMPAD_2: 95; // VK_NUMPAD2, 0x62, Numeric keypad 2 key
    NUMPAD_3: 96; // VK_NUMPAD3, 0x63, Numeric keypad 3 key
    NUMPAD_4: 97; // VK_NUMPAD4, 0x64, Numeric keypad 4 key
    NUMPAD_5: 98; // VK_NUMPAD5, 0x65, Numeric keypad 5 key
    NUMPAD_6: 99; // VK_NUMPAD6, 0x66, Numeric keypad 6 key
    NUMPAD_7: 100; // VK_NUMPAD7, 0x67, Numeric keypad 7 key
    NUMPAD_8: 101; // VK_NUMPAD8, 0x68, Numeric keypad 8 key
    NUMPAD_9: 102; // VK_NUMPAD9, 0x69, Numeric keypad 9 key

    NUMPAD_MULTIPLY: 103; // VK_MULTIPLY, 0x6A, Multiply key
    NUMPAD_ADD: 104; // VK_ADD, 0x6B, Add key
    NUMPAD_SEPARATOR: 105; // VK_SEPARATOR, 0x6C, Separator key
    NUMPAD_SUBTRACT: 106; // VK_SUBTRACT, 0x6D, Subtract key
    NUMPAD_DECIMAL: 107; // VK_DECIMAL, 0x6E, Decimal key
    NUMPAD_DIVIDE: 108; // VK_DIVIDE, 0x6F,

    /**
     * Cover all key codes when IME is processing input.
     */
    KEY_IN_COMPOSITION: 109;

    ABNT_C1: 110; // Brazilian (ABNT) Keyboard
    ABNT_C2: 111; // Brazilian (ABNT) Keyboard
  };
};

type MenuBars = {
  CommandPalette: number;
  DebugBreakpointsContext: number;
  DebugCallStackContext: number;
  DebugConsoleContext: number;
  DebugVariablesContext: number;
  DebugWatchContext: number;
  EditorContext: number;
  EditorTitle: number;
  EditorTitleContext: number;
  EmptyEditorGroupContext: number;
  ExplorerContext: number;
  MenubarAppearanceMenu: number;
  MenubarDebugMenu: number;
  MenubarEditMenu: number;
  MenubarFileMenu: number;
  MenubarGoMenu: number;
  MenubarHelpMenu: number;
  MenubarLayoutMenu: number;
  MenubarNewBreakpointMenu: number;
  MenubarPreferencesMenu: number;
  MenubarRecentMenu: number;
  MenubarSelectionMenu: number;
  MenubarSwitchEditorMenu: number;
  MenubarSwitchGroupMenu: number;
  MenubarTerminalMenu: number;
  MenubarViewMenu: number;
  OpenEditorsContext: number;
  ProblemsPanelContext: number;
  SCMChangeContext: number;
  SCMResourceContext: number;
  SCMResourceGroupContext: number;
  SCMSourceControl: number;
  SCMTitle: number;
  SearchContext: number;
  TouchBarContext: number;
  ViewItemContext: number;
  ViewTitle: number;
};

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

  public keyCodes: KeyMap;
  public menuBarIds: MenuBars;

  public acquireController(controller: any) {
    this.controller = controller;
    this.keyCodes = context.require('vs/base/common/keyCodes');
    const { MenuId } = context.require('vs/platform/actions/common/actions');
    this.menuBarIds = MenuId;

    console.log(this.keyCodes);
    // this.addWorkbenchActions();
  }

  public loadScript(scripts: string[], cb: () => void) {
    bootstrap(scripts, true)(cb);
  }

  private addWorkbenchActions() {
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
        primary:
          this.keyCodes.KeyMod.Shift |
          this.keyCodes.KeyMod.Alt |
          this.keyCodes.KeyCode.KEY_9,
        mac: {
          primary:
            this.keyCodes.KeyMod.CtrlCmd |
            this.keyCodes.KeyMod.Alt |
            this.keyCodes.KeyCode.KEY_9,
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

    this.appendMenuItem(this.menuBarIds.MenubarFileMenu, {
      group: '1_new',
      order: 1,
      command: {
        id: 'codesandbox.sandbox.new',
        title: 'New Sandbox...',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarFileMenu, {
      // Z to be the last item after vscode group 4
      group: '4_zsandbox',
      order: 1,
      command: {
        id: 'codesandbox.sandbox.fork',
        title: '&&Fork Sandbox',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarFileMenu, {
      group: '4_zsandbox',
      order: 2,
      command: {
        id: 'codesandbox.sandbox.exportzip',
        title: 'Export to ZIP',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarPreferencesMenu, {
      group: '1_settings',
      order: 1,
      command: {
        id: 'codesandbox.preferences',
        title: 'CodeSandbox Settings',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarLayoutMenu, {
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
      'https://github.com/CompuIves/codesandbox-client/issues'
    );
    addBrowserNavigationCommand(
      'codesandbox.help.github',
      'Open Our GitHub Repository',
      'https://github.com/CompuIves/codesandbox-client'
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

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '1_resources',
      order: 1,
      command: {
        id: 'codesandbox.help.documentation',
        title: '&&Documentation',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '1_resources',
      order: 2,
      command: {
        id: 'codesandbox.explore',
        title: '&&Explore Sandboxes',
      },
    });
    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '1_resources',
      order: 3,
      command: {
        id: 'codesandbox.search',
        title: '&&Search',
      },
    });
    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '1_resources',
      order: 4,
      command: {
        id: 'codesandbox.dashboard',
        title: 'D&&ashboard',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '2_help',
      order: 1,
      command: {
        id: 'codesandbox.help.open-issue',
        title: '&&Open Issue on GitHub',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '2_help',
      order: 2,
      command: {
        id: 'codesandbox.help.feedback',
        title: 'Submit &&Feedback...',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '3_social',
      order: 1,
      command: {
        id: 'codesandbox.help.github',
        title: '&&GitHub Repository',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '3_social',
      order: 2,
      command: {
        id: 'codesandbox.help.twitter',
        title: 'Follow Us on &&Twitter',
      },
    });

    this.appendMenuItem(this.menuBarIds.MenubarHelpMenu, {
      group: '3_social',
      order: 3,
      command: {
        id: 'codesandbox.help.spectrum',
        title: 'Join Us on S&&pectrum',
      },
    });
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
      const [{ IConfigurationService }] = [
        context.require('vs/platform/configuration/common/configuration'),
      ];

      const workspaceService = this.serviceCache.get(IConfigurationService);

      workspaceService.initialize(context.monaco.editor.getDefaultWorkspace());

      cb(this.serviceCache);
      return;
    }

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
      ({ serviceCollection, dispose }) => {
        this.serviceCache = serviceCollection;

        // Initialize status bar
        const statusbarPart = serviceCollection.get(IStatusbarService);
        this.statusbarPart.resolve(statusbarPart);

        // Initialize menu bar
        const menubarPart = serviceCollection.get('menubar');
        this.menubarPart.resolve(menubarPart);

        // Initialize command service
        const commandService = serviceCollection.get(ICommandService);
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
}

export default new VSCodeManager();
