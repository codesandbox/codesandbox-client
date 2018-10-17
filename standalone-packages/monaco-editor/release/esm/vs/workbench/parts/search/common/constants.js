/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
export var FindInFilesActionId = 'workbench.action.findInFiles';
export var FocusActiveEditorCommandId = 'search.action.focusActiveEditor';
export var FocusSearchFromResults = 'search.action.focusSearchFromResults';
export var OpenMatchToSide = 'search.action.openResultToSide';
export var CancelActionId = 'search.action.cancel';
export var RemoveActionId = 'search.action.remove';
export var CopyPathCommandId = 'search.action.copyPath';
export var CopyMatchCommandId = 'search.action.copyMatch';
export var CopyAllCommandId = 'search.action.copyAll';
export var ClearSearchHistoryCommandId = 'search.action.clearHistory';
export var FocusSearchListCommandID = 'search.action.focusSearchList';
export var ReplaceActionId = 'search.action.replace';
export var ReplaceAllInFileActionId = 'search.action.replaceAllInFile';
export var ReplaceAllInFolderActionId = 'search.action.replaceAllInFolder';
export var CloseReplaceWidgetActionId = 'closeReplaceInFilesWidget';
export var ToggleCaseSensitiveCommandId = 'toggleSearchCaseSensitive';
export var ToggleWholeWordCommandId = 'toggleSearchWholeWord';
export var ToggleRegexCommandId = 'toggleSearchRegex';
export var ToggleSearchViewPositionCommandId = 'search.action.toggleSearchViewPosition';
export var SearchViewVisibleKey = new RawContextKey('searchViewletVisible', true);
export var SearchViewFocusedKey = new RawContextKey('searchViewletFocus', false);
export var InputBoxFocusedKey = new RawContextKey('inputBoxFocus', false);
export var SearchInputBoxFocusedKey = new RawContextKey('searchInputBoxFocus', false);
export var ReplaceInputBoxFocusedKey = new RawContextKey('replaceInputBoxFocus', false);
export var PatternIncludesFocusedKey = new RawContextKey('patternIncludesInputBoxFocus', false);
export var PatternExcludesFocusedKey = new RawContextKey('patternExcludesInputBoxFocus', false);
export var ReplaceActiveKey = new RawContextKey('replaceActive', false);
export var HasSearchResults = new RawContextKey('hasSearchResult', false);
export var FirstMatchFocusKey = new RawContextKey('firstMatchFocus', false);
export var FileMatchOrMatchFocusKey = new RawContextKey('fileMatchOrMatchFocus', false); // This is actually, Match or File or Folder
export var FileMatchOrFolderMatchFocusKey = new RawContextKey('fileMatchOrFolderMatchFocus', false);
export var FileFocusKey = new RawContextKey('fileMatchFocus', false);
export var FolderFocusKey = new RawContextKey('folderMatchFocus', false);
export var MatchFocusKey = new RawContextKey('matchFocus', false);
