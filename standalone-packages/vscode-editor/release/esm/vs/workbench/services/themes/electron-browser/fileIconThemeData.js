/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import * as Paths from '../../../../../path.js';
import * as resources from '../../../../base/common/resources.js';
import * as Json from '../../../../base/common/json.js';
import { getParseErrorMessage } from '../../../../base/common/jsonErrorMessages.js';
var FileIconThemeData = /** @class */ (function () {
    function FileIconThemeData() {
    }
    FileIconThemeData.prototype.ensureLoaded = function (fileService) {
        var _this = this;
        if (!this.isLoaded) {
            if (this.location) {
                return _loadIconThemeDocument(fileService, this.location).then(function (iconThemeDocument) {
                    var result = _processIconThemeDocument(_this.id, _this.location, iconThemeDocument);
                    _this.styleSheetContent = result.content;
                    _this.hasFileIcons = result.hasFileIcons;
                    _this.hasFolderIcons = result.hasFolderIcons;
                    _this.hidesExplorerArrows = result.hidesExplorerArrows;
                    _this.isLoaded = true;
                    return _this.styleSheetContent;
                });
            }
        }
        return Promise.resolve(this.styleSheetContent);
    };
    FileIconThemeData.fromExtensionTheme = function (iconTheme, iconThemeLocation, extensionData) {
        var themeData = new FileIconThemeData();
        themeData.id = extensionData.extensionId + '-' + iconTheme.id;
        themeData.label = iconTheme.label || Paths.basename(iconTheme.path);
        themeData.settingsId = iconTheme.id;
        themeData.description = iconTheme.description;
        themeData.location = iconThemeLocation;
        themeData.extensionData = extensionData;
        themeData.isLoaded = false;
        return themeData;
    };
    FileIconThemeData.noIconTheme = function () {
        var themeData = FileIconThemeData._noIconTheme;
        if (!themeData) {
            themeData = FileIconThemeData._noIconTheme = new FileIconThemeData();
            themeData.id = '';
            themeData.label = '';
            themeData.settingsId = null;
            themeData.hasFileIcons = false;
            themeData.hasFolderIcons = false;
            themeData.hidesExplorerArrows = false;
            themeData.isLoaded = true;
            themeData.extensionData = null;
        }
        return themeData;
    };
    FileIconThemeData.fromStorageData = function (input) {
        try {
            var data = JSON.parse(input);
            var theme = new FileIconThemeData();
            for (var key in data) {
                switch (key) {
                    case 'id':
                    case 'label':
                    case 'description':
                    case 'settingsId':
                    case 'extensionData':
                    case 'styleSheetContent':
                    case 'hasFileIcons':
                    case 'hidesExplorerArrows':
                    case 'hasFolderIcons':
                        theme[key] = data[key];
                        break;
                    case 'location':
                        theme.location = URI.revive(data.location);
                        break;
                }
            }
            return theme;
        }
        catch (e) {
            return null;
        }
    };
    FileIconThemeData.prototype.toStorageData = function () {
        return JSON.stringify({
            id: this.id,
            label: this.label,
            description: this.description,
            settingsId: this.settingsId,
            location: this.location,
            styleSheetContent: this.styleSheetContent,
            hasFileIcons: this.hasFileIcons,
            hasFolderIcons: this.hasFolderIcons,
            hidesExplorerArrows: this.hidesExplorerArrows
        });
    };
    FileIconThemeData._noIconTheme = null;
    return FileIconThemeData;
}());
export { FileIconThemeData };
function _loadIconThemeDocument(fileService, location) {
    return fileService.resolveContent(location, { encoding: 'utf8' }).then(function (content) {
        var errors = [];
        var contentValue = Json.parse(content.value.toString(), errors);
        if (errors.length > 0 || !contentValue) {
            return Promise.reject(new Error(nls.localize('error.cannotparseicontheme', "Problems parsing file icons file: {0}", errors.map(function (e) { return getParseErrorMessage(e.error); }).join(', '))));
        }
        return Promise.resolve(contentValue);
    });
}
function _processIconThemeDocument(id, iconThemeDocumentLocation, iconThemeDocument) {
    var result = { content: '', hasFileIcons: false, hasFolderIcons: false, hidesExplorerArrows: iconThemeDocument.hidesExplorerArrows };
    if (!iconThemeDocument.iconDefinitions) {
        return result;
    }
    var selectorByDefinitionId = {};
    var iconThemeDocumentLocationDirname = resources.dirname(iconThemeDocumentLocation);
    function resolvePath(path) {
        return resources.joinPath(iconThemeDocumentLocationDirname, path);
    }
    function collectSelectors(associations, baseThemeClassName) {
        function addSelector(selector, defId) {
            if (defId) {
                var list = selectorByDefinitionId[defId];
                if (!list) {
                    list = selectorByDefinitionId[defId] = [];
                }
                list.push(selector);
            }
        }
        if (associations) {
            var qualifier = '.show-file-icons';
            if (baseThemeClassName) {
                qualifier = baseThemeClassName + ' ' + qualifier;
            }
            var expanded = '.monaco-tree-row.expanded'; // workaround for #11453
            if (associations.folder) {
                addSelector(qualifier + " .folder-icon::before", associations.folder);
                result.hasFolderIcons = true;
            }
            if (associations.folderExpanded) {
                addSelector(qualifier + " " + expanded + " .folder-icon::before", associations.folderExpanded);
                result.hasFolderIcons = true;
            }
            var rootFolder = associations.rootFolder || associations.folder;
            var rootFolderExpanded = associations.rootFolderExpanded || associations.folderExpanded;
            if (rootFolder) {
                addSelector(qualifier + " .rootfolder-icon::before", rootFolder);
                result.hasFolderIcons = true;
            }
            if (rootFolderExpanded) {
                addSelector(qualifier + " " + expanded + " .rootfolder-icon::before", rootFolderExpanded);
                result.hasFolderIcons = true;
            }
            if (associations.file) {
                addSelector(qualifier + " .file-icon::before", associations.file);
                result.hasFileIcons = true;
            }
            var folderNames = associations.folderNames;
            if (folderNames) {
                for (var folderName in folderNames) {
                    addSelector(qualifier + " ." + escapeCSS(folderName.toLowerCase()) + "-name-folder-icon.folder-icon::before", folderNames[folderName]);
                    result.hasFolderIcons = true;
                }
            }
            var folderNamesExpanded = associations.folderNamesExpanded;
            if (folderNamesExpanded) {
                for (var folderName in folderNamesExpanded) {
                    addSelector(qualifier + " " + expanded + " ." + escapeCSS(folderName.toLowerCase()) + "-name-folder-icon.folder-icon::before", folderNamesExpanded[folderName]);
                    result.hasFolderIcons = true;
                }
            }
            var languageIds = associations.languageIds;
            if (languageIds) {
                if (!languageIds.jsonc && languageIds.json) {
                    languageIds.jsonc = languageIds.json;
                }
                for (var languageId in languageIds) {
                    addSelector(qualifier + " ." + escapeCSS(languageId) + "-lang-file-icon.file-icon::before", languageIds[languageId]);
                    result.hasFileIcons = true;
                }
            }
            var fileExtensions = associations.fileExtensions;
            if (fileExtensions) {
                for (var fileExtension in fileExtensions) {
                    var selectors = [];
                    var segments = fileExtension.toLowerCase().split('.');
                    if (segments.length) {
                        for (var i = 0; i < segments.length; i++) {
                            selectors.push("." + escapeCSS(segments.slice(i).join('.')) + "-ext-file-icon");
                        }
                        selectors.push('.ext-file-icon'); // extra segment to increase file-ext score
                    }
                    addSelector(qualifier + " " + selectors.join('') + ".file-icon::before", fileExtensions[fileExtension]);
                    result.hasFileIcons = true;
                }
            }
            var fileNames = associations.fileNames;
            if (fileNames) {
                for (var fileName in fileNames) {
                    var selectors = [];
                    fileName = fileName.toLowerCase();
                    selectors.push("." + escapeCSS(fileName) + "-name-file-icon");
                    var segments = fileName.split('.');
                    if (segments.length) {
                        for (var i = 1; i < segments.length; i++) {
                            selectors.push("." + escapeCSS(segments.slice(i).join('.')) + "-ext-file-icon");
                        }
                        selectors.push('.ext-file-icon'); // extra segment to increase file-ext score
                    }
                    addSelector(qualifier + " " + selectors.join('') + ".file-icon::before", fileNames[fileName]);
                    result.hasFileIcons = true;
                }
            }
        }
    }
    collectSelectors(iconThemeDocument);
    collectSelectors(iconThemeDocument.light, '.vs');
    collectSelectors(iconThemeDocument.highContrast, '.hc-black');
    if (!result.hasFileIcons && !result.hasFolderIcons) {
        return result;
    }
    var cssRules = [];
    var fonts = iconThemeDocument.fonts;
    if (Array.isArray(fonts)) {
        fonts.forEach(function (font) {
            var src = font.src.map(function (l) { return "url('" + resolvePath(l.path) + "') format('" + l.format + "')"; }).join(', ');
            cssRules.push("@font-face { src: " + src + "; font-family: '" + font.id + "'; font-weight: " + font.weight + "; font-style: " + font.style + "; }");
        });
        cssRules.push(".show-file-icons .file-icon::before, .show-file-icons .folder-icon::before, .show-file-icons .rootfolder-icon::before { font-family: '" + fonts[0].id + "'; font-size: " + (fonts[0].size || '150%') + "}");
    }
    for (var defId in selectorByDefinitionId) {
        var selectors = selectorByDefinitionId[defId];
        var definition = iconThemeDocument.iconDefinitions[defId];
        if (definition) {
            if (definition.iconPath) {
                cssRules.push(selectors.join(', ') + " { content: ' '; background-image: url(\"" + resolvePath(definition.iconPath) + "\"); }");
            }
            if (definition.fontCharacter || definition.fontColor) {
                var body = '';
                if (definition.fontColor) {
                    body += " color: " + definition.fontColor + ";";
                }
                if (definition.fontCharacter) {
                    body += " content: '" + definition.fontCharacter + "';";
                }
                if (definition.fontSize) {
                    body += " font-size: " + definition.fontSize + ";";
                }
                if (definition.fontId) {
                    body += " font-family: " + definition.fontId + ";";
                }
                cssRules.push(selectors.join(', ') + " { " + body + " }");
            }
        }
    }
    result.content = cssRules.join('\n');
    return result;
}
function escapeCSS(str) {
    return window['CSS'].escape(str);
}
