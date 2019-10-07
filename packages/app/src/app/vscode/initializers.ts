import { vscode } from 'app/vscode';

export function initializeThemeCache() {
  try {
    if (!localStorage.getItem('vs-global://colorThemeData')) {
      localStorage.setItem('newUser', 'true');
      import('./theme-cache').then(rawTheme => {
        localStorage.setItem('vs-global://colorThemeData', rawTheme.default);
      });
    } else {
      localStorage.removeItem('newUser');
    }
  } catch (e) {
    console.error(e);
  }
}

export function initializeExtensionsFolder() {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const fs = BrowserFS.BFSRequire('fs');

  if (!fs.existsSync('/vscode/extensions')) {
    fs.mkdirSync('/vscode/extensions');
  }
}

export function initializeSettings() {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const fs = BrowserFS.BFSRequire('fs');
  if (!fs.existsSync('/vscode/settings.json')) {
    fs.writeFileSync(
      '/vscode/settings.json',
      JSON.stringify(
        {
          'editor.formatOnSave': true,
          'editor.fontSize': 15,
          'editor.fontFamily': "dm, Menlo, Monaco, 'Courier New', monospace",
          'editor.tabSize': 2,
          'editor.minimap.enabled': false,
          'workbench.editor.openSideBySideDirection': 'down',
          'svelte.plugin.typescript.diagnostics.enable': false,
        },
        null,
        2
      )
    );
  }
}

/**
 * This auto installs an extension with a custom theme specified in preferences. People can select
 * it as "Custom Theme".
 */
export function initializeCustomTheme() {
  const customTheme = localStorage.getItem('settings.manualCustomVSCodeTheme');
  if (customTheme) {
    const packageJSON = {
      name: 'custom',
      displayName: 'Custom Theme',
      description: 'The Custom VSCode Theme',
      version: '0.4.1',
      publisher: 'CodeSandbox',
      license: 'SEE LICENSE IN LICENSE.md',
      repository: {
        type: 'git',
        url: 'https://github.com/sdras/night-owl-vscode-theme',
      },
      keywords: [],
      scripts: {
        publish: 'vsce publish',
      },
      galleryBanner: {
        color: '#061526',
        theme: 'dark',
      },
      engines: {
        vscode: '^1.17.0',
      },
      categories: ['Themes'],
      contributes: {
        themes: [
          {
            label: 'Custom Theme',
            uiTheme: 'vs-dark',
            path: './themes/custom-color-theme.json',
          },
        ],
      },
    };

    // @ts-ignore
    // eslint-disable-next-line no-undef
    const fs = BrowserFS.BFSRequire('fs');
    fs.writeFileSync(
      '/extensions/custom-theme/package.json',
      JSON.stringify(packageJSON)
    );
    fs.mkdirSync('/extensions/custom-theme/themes');
    fs.writeFileSync(
      '/extensions/custom-theme/themes/custom-color-theme.json',
      JSON.parse(customTheme)
    );
  }
}

const VIM_EXTENSION_ID = 'vscodevim.vim';
export function setVimExtensionEnabled(vimEnabled: boolean) {
  if (vimEnabled) {
    vscode.enableExtension(VIM_EXTENSION_ID);
  } else {
    // Auto disable vim extension
    if (
      [null, undefined].includes(
        localStorage.getItem('vs-global://extensionsIdentifiers/disabled')
      )
    ) {
      localStorage.setItem(
        'vs-global://extensionsIdentifiers/disabled',
        '[{"id":"vscodevim.vim"}]'
      );
    }

    vscode.disableExtension(VIM_EXTENSION_ID);
  }
}
