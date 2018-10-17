import '../workbench/browser/parts/quickopen/quickopen.contribution';
import '../workbench/parts/quickopen/browser/quickopen.contribution';
import '../workbench/browser/parts/editor/editorPicker';
import '../workbench/browser/parts/quickinput/quickInput.contribution';
import '../workbench/parts/search/electron-browser/search.contribution';
import './configuration.contribution';
import '../workbench/parts/preferences/electron-browser/preferences.contribution';
import '../workbench/parts/files/electron-browser/files.contribution';
import './services/codesandbox/codesandbox.contribution';
// import 'vs/workbench/api/electron-browser/extensionHost.contribution';
// This is taken from vs/workbench/parts/codeEditor.contribution and then
// cherry picked. We should keep this up to date.
// import 'vs/workbench/parts/codeEditor/electron-browser/accessibility';
// import 'vs/workbench/parts/codeEditor/electron-browser/inspectKeybindings';
import '../workbench/parts/codeEditor/electron-browser/largeFileOptimizations';
import '../workbench/parts/codeEditor/browser/menuPreventer';
import '../workbench/parts/codeEditor/electron-browser/selectionClipboard';
// import 'vs/workbench/parts/codeEditor/electron-browser/textMate/inspectTMScopes';
import '../workbench/parts/codeEditor/electron-browser/toggleMinimap';
import '../workbench/parts/codeEditor/electron-browser/toggleMultiCursorModifier';
import '../workbench/parts/codeEditor/electron-browser/toggleRenderControlCharacter';
import '../workbench/parts/codeEditor/electron-browser/toggleRenderWhitespace';
import '../workbench/parts/codeEditor/electron-browser/toggleWordWrap';
import '../workbench/parts/codeEditor/electron-browser/workbenchReferenceSearch';
import '../workbench/parts/snippets/electron-browser/snippets.contribution';
import '../workbench/parts/snippets/electron-browser/snippetsService';
import '../workbench/parts/snippets/electron-browser/insertSnippet';
import '../workbench/parts/snippets/electron-browser/configureSnippets';
import '../workbench/parts/snippets/electron-browser/tabCompletion';
import '../workbench/browser/parts/editor/breadcrumbs';
// // Import when extension system is ready
// import 'vs/workbench/parts/emmet/browser/emmet.browser.contribution';
// import 'vs/workbench/parts/emmet/electron-browser/emmet.contribution';
// import 'vs/workbench/services/extensions/electron-browser/extensionHost';
import '../workbench/browser/actions/toggleZenMode';
import '../workbench/browser/actions/toggleTabsVisibility';
import '../workbench/parts/preferences/browser/keybindingsEditorContribution';
import './services/codesandbox/browser/codesandboxService';
