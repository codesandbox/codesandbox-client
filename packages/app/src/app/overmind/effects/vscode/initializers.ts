import codeSandboxTheme from '@codesandbox/common/lib/themes/codesandbox.json';
import codeSandboxBlackTheme from '@codesandbox/common/lib/themes/codesandbox-black';

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
  const fs = window.BrowserFS.BFSRequire('fs');

  if (!fs.existsSync('/vscode/extensions')) {
    fs.mkdirSync('/vscode/extensions');
  }
}

export function initializeSettings() {
  // @ts-ignore
  const fs = window.BrowserFS.BFSRequire('fs');
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

  try {
    // We need to do this to prevent duplicate closing tags in live sessions.
    // https://github.com/codesandbox/codesandbox-client/issues/3398
    // I haven't found another way to fix this, as the TS extension literally listens
    // for edits and checks whether an edit ends with '>'. Then it asks the LSP for the changes
    // and applies them 100ms later. There is no check for cursor or anything else.
    // This doesn't happen in VSCode Live Share itself, because there they share the LSP between
    // multiple users. This way the request is not duplicated among multiple users.
    const settings = JSON.parse(
      fs.readFileSync('/vscode/settings.json').toString()
    );
    settings['javascript.autoClosingTags'] = false;
    settings['typescript.autoClosingTags'] = false;
    settings['typescript.tsserver.useSeparateSyntaxServer'] = false;

    if (!settings['workbench.colorTheme']) {
      // if you have not changed the theme ever,
      // we set codesandbox black as the theme for you
      settings['workbench.colorTheme'] = 'CodeSandbox Black';
    }

    fs.writeFileSync(
      '/vscode/settings.json',
      JSON.stringify(settings, null, 2)
    );
  } catch (e) {
    console.warn(e);
  }
}

export function initializeCodeSandboxTheme() {
  // @ts-ignore
  const fs = window.BrowserFS.BFSRequire('fs');

  fs.writeFileSync(
    '/extensions/ngryman.codesandbox-theme-0.0.1/themes/CodeSandbox-color-theme.json',
    JSON.stringify(codeSandboxTheme)
  );

  fs.writeFileSync(
    '/extensions/codesandbox-black-0.0.1/themes/codesandbox-black.json',
    JSON.stringify(codeSandboxBlackTheme)
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
  const fs = window.BrowserFS.BFSRequire('fs');
  const extName = `${id}-theme`;

  const folder = `/extensions/${extName}`;
  const folderExists = fs.existsSync(folder);
  if (!folderExists) {
    fs.mkdirSync(folder);
  }
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
}
