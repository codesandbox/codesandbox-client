import { types } from 'mobx-state-tree';

export default {
  settings: types.model({
    prettifyOnSaveEnabled: types.boolean,
    autoCompleteEnabled: types.boolean,
    livePreviewEnabled: types.boolean,
    lintEnabled: types.boolean,
    instantPreviewEnabled: types.boolean,
    fontSize: types.number,
    fontFamily: types.string,
    lineHeight: types.number,
    clearConsoleEnabled: types.boolean,
    autoDownloadTypes: types.boolean,
    codeMirror: types.boolean,
    keybindings: types.array(
      types.model({
        key: types.string,
        bindings: types.array(types.maybeNull(types.array(types.string))),
      })
    ),
    newPackagerExperiment: types.boolean,
    prettierConfig: types.model({
      fluid: types.maybe(types.boolean),
      printWidth: types.maybe(types.number),
      tabWidth: types.maybe(types.number),
      useTabs: types.maybe(types.boolean),
      semi: types.maybe(types.boolean),
      singleQuote: types.maybe(types.boolean),
      trailingComma: types.maybe(types.string),
      bracketSpacing: types.maybe(types.boolean),
      jsxBracketSameLine: types.maybe(types.boolean),
    }),
    jsxBracketSameLine: types.boolean,
    printWidth: types.number,
    semi: types.boolean,
    singleQuote: types.boolean,
    tabWidth: types.number,
    trailingComma: types.string,
    useTabs: types.boolean,
    vimMode: types.boolean,
    zenMode: types.boolean,
    enableLigatures: types.boolean,
    editorTheme: types.string,
    customVSCodeTheme: types.maybeNull(types.string),

    experimentVSCode: types.maybeNull(types.boolean),
  }),
  isLoadingPaymentDetails: types.boolean,
  itemId: types.string,
  showEditor: types.boolean,
  showPreview: types.boolean,
  showDevtools: types.boolean,
  paymentDetailError: types.maybeNull(types.string),
  paymentDetails: types.maybeNull(
    types.model({
      brand: types.string,
      expMonth: types.number,
      expYear: types.number,
      last4: types.string,
      name: types.string,
    })
  ),
  runOnClick: types.maybeNull(types.boolean),
};
