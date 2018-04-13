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
        bindings: types.array(types.maybe(types.array(types.string))),
      })
    ),
    newPackagerExperiment: types.boolean,
    prettierConfig: types.model({
      printWidth: types.number,
      tabWidth: types.number,
      useTabs: types.boolean,
      semi: types.boolean,
      singleQuote: types.boolean,
      trailingComma: types.string,
      bracketSpacing: types.boolean,
      jsxBracketSameLine: types.boolean,
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
  }),
  isLoadingPaymentDetails: types.boolean,
  itemId: types.string,
  showEditor: types.boolean,
  showPreview: types.boolean,
  showDevtools: types.boolean,
  paymentDetailError: types.maybe(types.string),
  paymentDetails: types.maybe(
    types.model({
      brand: types.string,
      expMonth: types.number,
      expYear: types.number,
      last4: types.string,
      name: types.string,
    })
  ),
  runOnClick: types.maybe(types.boolean),
};
