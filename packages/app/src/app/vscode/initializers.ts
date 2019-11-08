/* eslint-disable no-undef */
import { vscode } from 'app/vscode';
import codeSandboxBlackTheme from '@codesandbox/common/lib/themes/codesandbox-black.json';
import codeSandboxTheme from '@codesandbox/common/lib/themes/codesandbox.json';

export function initializeThemeCache() {
  try {
    if (!localStorage.getItem('vs-global://colorThemeData')) {
      import('./theme-cache').then(rawTheme => {
        localStorage.setItem('vs-global://colorThemeData', rawTheme.default);
      });
    }
  } catch (e) {
    console.error(e);
  }
}

export function initializeExtensionsFolder() {
  // @ts-ignore
  const fs = BrowserFS.BFSRequire('fs');

  if (!fs.existsSync('/vscode/extensions')) {
    fs.mkdirSync('/vscode/extensions');
  }
}

export function initializeSettings() {
  // @ts-ignore
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

export function initializeCodeSandboxTheme() {
  // @ts-ignore
  const fs = BrowserFS.BFSRequire('fs');

  fs.writeFileSync(
    '/extensions/ngryman.codesandbox-theme-0.0.1/themes/CodeSandbox-color-theme.json',
    JSON.stringify(codeSandboxTheme)
  );
}

export function installCustomTheme(id: string, name: string, theme: string) {
  const packageJSON = {
    name: id,
    displayName: name,
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
          label: name,
          uiTheme: 'vs-dark',
          path: './themes/custom-color-theme.json',
        },
      ],
    },
  };

  // @ts-ignore
  const fs = BrowserFS.BFSRequire('fs');
  const extName = `${id}-theme`;
  fs.mkdirSync(`/extensions/${extName}`);
  fs.writeFileSync(
    `/extensions/${extName}/package.json`,
    JSON.stringify(packageJSON)
  );

  fs.mkdirSync(`/extensions/${extName}/themes`);
  fs.writeFileSync(
    `/extensions/${extName}/themes/custom-color-theme.json`,
    theme
  );
}

/**
 * This auto installs an extension with a custom theme specified in preferences. People can select
 * it as "Custom Theme".
 */
export function initializeCustomTheme() {
  const customTheme = localStorage.getItem('settings.manualCustomVSCodeTheme');

  if (customTheme) {
    installCustomTheme('custom', 'Custom Theme', customTheme);
  }

  installCustomTheme(
    'codesandbox-black',
    'CodeSandbox Black',
    JSON.stringify(codeSandboxBlackTheme)
  );
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
