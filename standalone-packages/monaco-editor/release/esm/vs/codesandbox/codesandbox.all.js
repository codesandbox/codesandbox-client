import '../workbench/browser/parts/quickopen/quickopen.contribution.js';
import '../workbench/parts/quickopen/browser/quickopen.contribution.js';
import '../workbench/browser/parts/editor/editorPicker.js';
import '../workbench/browser/parts/quickinput/quickInput.contribution.js';
import '../workbench/parts/search/electron-browser/search.contribution.js';
import './configuration.contribution.js';
import '../workbench/parts/preferences/electron-browser/preferences.contribution.js';
import '../workbench/parts/files/electron-browser/files.contribution.js';
import './services/codesandbox/codesandbox.contribution.js';
// import 'vs/workbench/api/electron-browser/extensionHost.contribution';
// This is taken from vs/workbench/parts/codeEditor.contribution and then
// cherry picked. We should keep this up to date.
// import 'vs/workbench/parts/codeEditor/electron-browser/accessibility';
// import 'vs/workbench/parts/codeEditor/electron-browser/inspectKeybindings';
import '../workbench/parts/codeEditor/electron-browser/largeFileOptimizations.js';
import '../workbench/parts/codeEditor/browser/menuPreventer.js';
import '../workbench/parts/codeEditor/electron-browser/selectionClipboard.js';
// import 'vs/workbench/parts/codeEditor/electron-browser/textMate/inspectTMScopes';
import '../workbench/parts/codeEditor/electron-browser/toggleMinimap.js';
import '../workbench/parts/codeEditor/electron-browser/toggleMultiCursorModifier.js';
import '../workbench/parts/codeEditor/electron-browser/toggleRenderControlCharacter.js';
import '../workbench/parts/codeEditor/electron-browser/toggleRenderWhitespace.js';
import '../workbench/parts/codeEditor/electron-browser/toggleWordWrap.js';
import '../workbench/parts/codeEditor/electron-browser/workbenchReferenceSearch.js';
import '../workbench/parts/snippets/electron-browser/snippets.contribution.js';
import '../workbench/parts/snippets/electron-browser/snippetsService.js';
import '../workbench/parts/snippets/electron-browser/insertSnippet.js';
import '../workbench/parts/snippets/electron-browser/configureSnippets.js';
import '../workbench/parts/snippets/electron-browser/tabCompletion.js';
import '../workbench/browser/parts/editor/breadcrumbs.js';
// // Import when extension system is ready
// import 'vs/workbench/parts/emmet/browser/emmet.browser.contribution';
// import 'vs/workbench/parts/emmet/electron-browser/emmet.contribution';
// import 'vs/workbench/services/extensions/electron-browser/extensionHost';
import '../workbench/browser/actions/toggleZenMode.js';
import '../workbench/browser/actions/toggleTabsVisibility.js';
import '../workbench/parts/preferences/browser/keybindingsEditorContribution.js';
import './services/codesandbox/browser/codesandboxService.js';
