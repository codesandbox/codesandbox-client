import store from 'store/dist/store.modern';

const allowedKeys = {
  autoCompleteEnabled: 'settings.autocomplete',
  vimMode: 'settings.vimmode',
  livePreviewEnabled: 'settings.livepreview',
  instantPreviewEnabled: 'settings.instantpreview',
  prettifyOnSaveEnabled: 'settings.prettifyonsave',
  prettierConfig: 'settings.prettierconfig',
  lintEnabled: 'settings.lintenabled',
  fontSize: 'settings.fontsize',
  fontFamily: 'settings.fontfamily',
  lineHeight: 'settings.lineheight',
  clearConsoleEnabled: 'settings.clearconsole',
  codeMirror: 'settings.codemirror',
  autoDownloadTypes: 'settings.autoDownloadTypes',
  newPackagerExperiment: 'settings.newPackagerExperiment',
  zenMode: 'settings.zenMode',
  keybindings: 'settings.keybindings',
  enableLigatures: 'settings.enableLigatures',
  customVSCodeTheme: 'settings.customVSCodeTheme',
  manualCustomVSCodeTheme: 'settings.manualCustomVSCodeTheme',
};

export default {
  getAll(): { [P in keyof typeof allowedKeys]: any } {
    return Object.keys(allowedKeys).reduce((result, prop) => {
      const value = this.get(allowedKeys[prop]);

      if (value !== undefined) {
        return Object.assign(result, {
          [prop]: value,
        });
      }

      return result;
    }, {}) as any;
  },
  get(key) {
    try {
      return store.get(key);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },
  set(prop, value) {
    if (!(prop in allowedKeys)) {
      // eslint-disable-next-line no-console
      console.warn(
        "Not setting key in preferences because it's not in the whitelist"
      );
      return;
    }

    try {
      store.set(allowedKeys[prop], value);
    } catch (e) {
      console.error(e);
    }
  },
};
