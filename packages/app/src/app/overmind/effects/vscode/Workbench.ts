import { KeyCode, KeyMod } from './keyCodes';

// Copied from 'common/actions' in vscode
export enum MenuId {
  CommandPalette,
  DebugBreakpointsContext,
  DebugCallStackContext,
  DebugConsoleContext,
  DebugVariablesContext,
  DebugWatchContext,
  DebugToolbar,
  EditorContext,
  EditorTitle,
  EditorTitleContext,
  EmptyEditorGroupContext,
  ExplorerContext,
  MenubarAppearanceMenu,
  MenubarDebugMenu,
  MenubarEditMenu,
  MenubarFileMenu,
  MenubarGoMenu,
  MenubarHelpMenu,
  MenubarLayoutMenu,
  MenubarNewBreakpointMenu,
  MenubarPreferencesMenu,
  MenubarRecentMenu,
  MenubarSelectionMenu,
  MenubarSwitchEditorMenu,
  MenubarSwitchGroupMenu,
  MenubarTerminalMenu,
  MenubarViewMenu,
  OpenEditorsContext,
  ProblemsPanelContext,
  SCMChangeContext,
  SCMResourceContext,
  SCMResourceGroupContext,
  SCMSourceControl,
  SCMTitle,
  SearchContext,
  TouchBarContext,
  ViewItemContext,
  ViewTitle,
}

export class Workbench {
  monaco: any;
  controller: { getState: any; getSignal: any };
  runCommand: (id: string) => Promise<void>;
  constructor(
    monaco: any,
    controller: { getState: any; getSignal: any },
    runCommand: (id: string) => Promise<void>
  ) {
    this.monaco = monaco;
    this.controller = controller;
    this.runCommand = runCommand;
  }

  public addWorkbenchActions() {
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

  private addWorkbenchAction({
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
    this.monaco.editor.addWorkbenchActions({
      id,
      label,
      commandLabel,
      run,
      category,
      keybindings,
    });
  }

  private appendMenuItem(
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
    this.monaco.editor.appendMenuItem(menubarId, item);
  }
}
