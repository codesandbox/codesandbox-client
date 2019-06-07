"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const elmOracle_1 = require("./elmOracle");
const elmUtils_1 = require("./elmUtils");
const config = vscode.workspace.getConfiguration('elm');
let gSrcDirs = [];
let gCwd = '';
let gImports = [];
let gOriginalWord = '';
let gAllModules = [];
function exposingList(exposing) {
    const separated = exposing.split(',');
    if (separated.length === 0) {
        // Handles (..) or single module imports
        return [exposing];
    }
    else {
        return separated;
    }
}
function toLowerOrHover(action, text) {
    return action === elmOracle_1.OracleAction.IsAutocomplete ? text.toLowerCase() : text;
}
/**
 * buildModulePaths
 * List the contents of the given directory and reads the beginning of each elm file
 * to find the module name. Uses recursion to find subdirectories
 * @param fullDirPath string The path to the directory to read
 */
function buildModulePaths(fullDirPath) {
    let modulePaths = [];
    fs.readdirSync(fullDirPath).forEach(file => {
        let stats = fs.statSync(path.join(fullDirPath, file));
        if (stats.isDirectory()) {
            modulePaths = [
                ...modulePaths,
                ...buildModulePaths(path.join(fullDirPath, file)),
            ];
        }
        else if (file.substr(-4) === '.elm') {
            let fullText = fs.readFileSync(path.join(fullDirPath, file), 'utf-8');
            const lines = fullText.split(/\r?\n/g);
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(/^module/)) {
                    modulePaths.push({
                        module: lines[i].split(' ')[1],
                        filePath: path.join(fullDirPath, file),
                        exposing: [],
                    });
                    break;
                }
            }
        }
    });
    return modulePaths;
}
/**
 * getModuleNames
 * Calls the buildModulePaths function for each elm source directory
 * @param cwd current working directory
 * @param srcDirs all elm src directorys (from elm-package.json)
 */
function getModuleNames(cwd, srcDirs) {
    let modulePaths = [];
    try {
        srcDirs.forEach(dir => {
            modulePaths = [...modulePaths, ...buildModulePaths(path.join(cwd, dir))];
        });
    }
    catch (e) {
        // Do not fail intellisense if this does not work
        console.error(e);
    }
    return modulePaths;
}
/**
 * getModuleFilePath
 * Return the file path of the given module name
 * Requires that buildModulePaths has already been run.  Only processes
 * if the userProjectImportStrategy is dynamicLookup or semiDynamicLookup
 * @param allModules The list of all modules and their file paths in this project
 * @param moduleName The current module name to look up
 */
function getModuleFilePath(allModules, moduleName) {
    if (config['userProjectImportStrategy'].includes('Lookup')) {
        try {
            return allModules.filter(item => item.module === moduleName)[0].filePath;
        }
        catch (e) {
            // Not found - this is a core imported module, move along
        }
    }
    return '';
}
/**
 * getFunctionComments
 * Return the function documentation if permitted in settings.
 * @param lines Subset of the lines of the file from start to the current function definition/type signature
 */
function getFunctionComments(lines) {
    try {
        let documentation = '';
        if (config['includeUserFunctionDocumentation'] !== true) {
            return documentation;
        }
        let inComment = false;
        for (let j = lines.length - 1; j >= 0; j--) {
            if (lines[j].trim() === '' && !inComment) {
                break;
            }
            if (lines[j].includes('-}')) {
                inComment = true;
            }
            if (inComment) {
                documentation = lines[j].trim() + ' ' + documentation;
            }
            if (lines[j].includes('{-|')) {
                inComment = false;
            }
        }
        if (documentation !== '') {
            documentation = '\n' + documentation;
        }
        return documentation;
    }
    catch (e) {
        // Do not reject all intellisense results just because a problem was encountered with the comments
        return '';
    }
}
function userProject(document, position, currentWord, action) {
    const fullText = document.getText();
    const lines = fullText.split(/\r?\n/g);
    let imports = [];
    let results = [];
    const [cwdTmp, elmVersion] = elmUtils_1.detectProjectRootAndElmVersion(document.fileName, vscode.workspace.rootPath);
    const cwd = config['useWorkSpaceRootForElmRoot']
        ? vscode.workspace.rootPath
        : cwdTmp;
    gCwd = cwd;
    let elmPackageString;
    if (elmVersion === '0.18') {
        elmPackageString = fs.readFileSync(path.join(cwd, 'elm-package.json'), 'utf-8');
    }
    else {
        elmPackageString = fs.readFileSync(path.join(cwd, 'elm.json'), 'utf-8');
    }
    const elmPackage = JSON.parse(elmPackageString);
    const srcDirs = elmPackage['source-directories']; // must use array notation for the key because of hyphen
    let allModules = [];
    if (config['userProjectImportStrategy'] === 'dynamicLookup') {
        allModules = getModuleNames(cwd, srcDirs);
    }
    else if (config['userProjectImportStrategy'] === 'semiDynamicLookup') {
        // For semi-dynamic, only populate once.  Window needs to be reloaded to pick up new files.
        // Faster performance for large numbers of modules.
        if (gAllModules.length === 0) {
            allModules = getModuleNames(cwd, srcDirs);
            gAllModules = allModules;
        }
        else {
            allModules = gAllModules;
        }
    }
    // Build list of this file's imported modules
    let commentBlock = false;
    for (let i = 0; i < lines.length; i++) {
        let match;
        if ((match = lines[i].match(/^import/))) {
            let exposingMatch;
            let moduleWords = lines[i].split(' ');
            if ((exposingMatch = lines[i].match(/exposing \(/))) {
                let asMatch;
                if ((asMatch = lines[i].match(/ as /))) {
                    imports.push({
                        module: moduleWords[3],
                        exposing: exposingList(lines[i].split('(')[1].replace(')', '')),
                        filePath: getModuleFilePath(allModules, moduleWords[1]),
                    });
                }
                else {
                    imports.push({
                        module: moduleWords[1],
                        exposing: exposingList(lines[i].split('(')[1].replace(')', '')),
                        filePath: getModuleFilePath(allModules, moduleWords[1]),
                    });
                }
            }
            else {
                let asMatch;
                if ((asMatch = lines[i].match(/ as /))) {
                    imports.push({
                        module: moduleWords[3],
                        exposing: [],
                        filePath: getModuleFilePath(allModules, moduleWords[1]),
                    });
                }
                else {
                    imports.push({
                        module: moduleWords[1],
                        exposing: [],
                        filePath: getModuleFilePath(allModules, moduleWords[1]),
                    });
                }
            }
        }
        else if (lines[i].trim() !== '' &&
            !lines[i].match(/^module/) &&
            commentBlock === false) {
            if (lines[i].trim().includes('{-')) {
                commentBlock = true;
            }
            else if (lines[i].trim().includes('-}')) {
                commentBlock = false;
            }
            else {
                break;
            }
        }
    }
    // Always suggest primitive types for autocomplete when making a function or type definition
    if (!currentWord.includes('.') &&
        action === elmOracle_1.OracleAction.IsAutocomplete &&
        (lines[position.line].includes(':') || lines[position.line].includes(' | '))) {
        let elmAddress = 'http://package.elm-lang.org/packages/elm-lang/core/latest';
        results = [
            {
                name: 'Int',
                fullName: 'Int',
                href: elmAddress,
                signature: 'Int',
                comment: '--Core type',
            },
            {
                name: 'String',
                fullName: 'String',
                href: elmAddress,
                signature: 'String',
                comment: '--Core type',
            },
            {
                name: 'Bool',
                fullName: 'Bool',
                href: elmAddress,
                signature: 'Bool',
                comment: '--Core type',
            },
            {
                name: 'Float',
                fullName: 'Float',
                href: elmAddress,
                signature: 'Float',
                comment: '--Core type',
            },
        ];
    }
    // Add the list of imports to the list of autocomplete suggestions
    if (action === elmOracle_1.OracleAction.IsAutocomplete &&
        currentWord.substr(-1) !== '.') {
        imports.map(item => {
            results.push({
                name: item.module,
                fullName: item.module,
                signature: 'import ' +
                    item.module +
                    (item.exposing.length > 0
                        ? ' exposing(' + item.exposing.join(', ') + ')'
                        : ''),
                href: document.fileName.toString(),
                kind: vscode.CompletionItemKind.Module,
                comment: 'Module imported at the top of this file',
            });
        });
    }
    gImports = imports;
    // Look in the current file for autocomplete information
    results = [
        ...results,
        ...localFunctions(document.fileName, null, action, lines, position, currentWord, null, srcDirs),
    ];
    // Look for imported functions - must scan for src in elm-package.json file
    let parseImports = true;
    if (parseImports) {
        if (currentWord.substr(-1) === '.' ||
            (action === elmOracle_1.OracleAction.IsHover && currentWord.includes('.'))) {
            let isMultiWordInclude = false;
            imports = imports.filter(item => {
                if (item.module === currentWord.split('.')[0]) {
                    return true;
                }
                const wordToMatch = action === elmOracle_1.OracleAction.IsAutocomplete
                    ? currentWord.slice(0, -1)
                    : currentWord.substr(0, currentWord.lastIndexOf('.'));
                if (item.module.includes('.') && item.module.includes(wordToMatch)) {
                    if (currentWord.indexOf('.') === currentWord.lastIndexOf('.')) {
                        // The current word only has 1 period, not enough to know which module to look up
                        isMultiWordInclude = true;
                    }
                    return true;
                }
            });
            if (isMultiWordInclude) {
                imports.map(item => {
                    results.push({
                        name: item.module.replace(currentWord, ''),
                        fullName: item.module,
                        signature: 'import ' +
                            item.module +
                            (item.exposing.length > 0
                                ? ' exposing(' + item.exposing.join(', ') + ')'
                                : ''),
                        href: document.fileName.toString(),
                        kind: vscode.CompletionItemKind.Module,
                        comment: 'Module imported at the top of this file',
                    });
                });
                return results;
            }
            // Set up the current word so that regex matching in localFunctions will find everything;
            // We are looking for all properties of the module name the user has fully qualified
            gOriginalWord = currentWord;
            currentWord =
                action === elmOracle_1.OracleAction.IsAutocomplete
                    ? '[a-zA-Z]'
                    : currentWord.substr(currentWord.lastIndexOf('.'));
        }
        gSrcDirs = srcDirs;
        srcDirs.forEach(dir => {
            imports.forEach(moduleFile => {
                let modulePath = moduleFile.module;
                let filePath = '';
                if (config['userProjectImportStrategy'].includes('Lookup')) {
                    filePath = moduleFile.filePath;
                }
                else if (moduleFile.module.includes('.')) {
                    if (config['userProjectImportStrategy'] === 'ignore') {
                        modulePath = '';
                    }
                    if (config['userProjectImportStrategy'] === 'dotIsFolder') {
                        modulePath = modulePath.replace('.', path.sep);
                    }
                    filePath = cwd + path.sep + dir + path.sep + modulePath + '.elm';
                }
                else {
                    filePath = cwd + path.sep + dir + path.sep + modulePath + '.elm';
                }
                try {
                    let importText = fs.readFileSync(filePath, 'utf-8');
                    let importResults = localFunctions(filePath, document.fileName, action, importText.split(/\r?\n/g), position, currentWord, imports, srcDirs);
                    results = [...results, ...importResults];
                }
                catch (e) {
                    // File is an imported module, you won't find it
                }
            });
        });
    }
    return results;
}
exports.userProject = userProject;
const splitOnSpace = config['includeParamsInUserAutocomplete'] === true ? null : ' ';
/**
 * localFunctions - Helper function to userProject which will find all type, type alias, and functions
 *                  Calls itself to look up type alias
 * @param filename from the vscode.TextDocument
 * @param callerFile optional parameter. If not set, we are looking in the current file, otherwise we are looking in an imported module
 * @param action from elmOracle. Whether the user is hovering or looking for autocomplete
 * @param lines array of lines of the current file
 * @param position the vscode.Position
 * @param currentWord the current word being hovered/autocompleted. Will get overridden to [a-zA-Z] when looking for members of a module
 * @param imports Optional parameter. The list of modules imported in the current file
 * @param srcDirs Optional parameter. The source directories in elm-package
 * @param isTypeAlias Optional parameter. True if localFunctions is being called to look for a type alias
 */
function localFunctions(filename, callerFile, action, lines, position, currentWord, imports, srcDirs, isTypeAlias) {
    let results = [];
    let test = new RegExp('^' +
        (action === elmOracle_1.OracleAction.IsAutocomplete
            ? currentWord.toLowerCase()
            : currentWord + ' '));
    let foundTypeAlias = false;
    let lookForTypeAlias = currentWord.substr(-1) === '.';
    for (let i = 0; i < lines.length; i++) {
        // Step 1: Get intellisense for type alias properties
        // Caller file is only null if this is the first call to localFunctions
        if (callerFile === null && lookForTypeAlias) {
            if (currentWord.substr(-1) === '.') {
                if (/^[a-z]/.test(currentWord)) {
                    // Only do this if it begins in lowercase (otherwise it would be a module)
                    let foundParams = false;
                    let paramIndex = 0;
                    let currentLine = '';
                    let trimmedLine = '';
                    if (foundTypeAlias) {
                        continue;
                    }
                    // Walk backwards through the file (starting at the current line) to see if this is a parameter in the current function
                    for (let j = position.line - 1; j > 0; j--) {
                        currentLine = lines[j];
                        trimmedLine = currentLine.trim();
                        if (trimmedLine === '') {
                            continue;
                        }
                        let params = currentLine.split(' ');
                        if (currentLine.includes('=') &&
                            params.filter((item, paramsIndex) => {
                                if (item === currentWord.slice(0, -1) && item.trim() !== '') {
                                    paramIndex = paramsIndex;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }).length > 0) {
                            // This item is a function parameter
                            foundParams = true;
                        }
                        if (foundParams) {
                            // Try and find the type signature of this function parameter based on the
                            // function signature, if found.
                            if (currentLine.includes(':')) {
                                let signaturePieces = currentLine.split(/(?:\:|->)/g);
                                let typeAlias;
                                typeAlias = signaturePieces[paramIndex].trim();
                                // Check if the type alias is defined in the calling file
                                let aliasResults = localFunctions(filename, filename, action, lines, position, typeAlias, null, null, true);
                                if (aliasResults.length === 0) {
                                    // Then check the imported files for it
                                    srcDirs.forEach(dir => {
                                        gImports.forEach(moduleFile => {
                                            let filePath = path.join(gCwd, dir, moduleFile.module + '.elm');
                                            try {
                                                if (aliasResults.length === 0) {
                                                    let importText = fs.readFileSync(filePath, 'utf-8');
                                                    let importResults = localFunctions(filePath, gCwd, action, importText.split(/\r?\n/g), position, typeAlias, null, null, true);
                                                    aliasResults = [...aliasResults, ...importResults];
                                                }
                                            }
                                            catch (e) {
                                                // File is an imported module, you won't find it
                                            }
                                        });
                                    });
                                }
                                if (aliasResults.length > 0) {
                                    foundTypeAlias = true;
                                    results = [...results, ...aliasResults];
                                    break;
                                }
                            }
                        }
                    }
                    // We finished walking all the way back through the file.  Either we found the type alias or we didn't
                    // Do not look for it on the next line
                    lookForTypeAlias = false;
                }
            }
        }
        // Step 2: See if the item we are looking up is qualified with a module name
        if (currentWord.includes('.')) {
            let importName = currentWord.split('.')[0];
            let func = currentWord.split('.')[1];
            // If this is a module and we aren't in the module file, we won't find any info for the current word
            if (!filename.includes(importName + '.elm')) {
                continue;
            }
            else {
                currentWord = func;
                test = new RegExp('^' + currentWord);
            }
        }
        // Step 3: Look for this item as a function. If this is an autocomplete, ignore case
        // If it is a hover, assume that the compiler would have caught a case mismatch by now and respect case.
        if (!isTypeAlias && test.test(toLowerOrHover(action, lines[i]))) {
            let typeSignature = '';
            let functionDefinition = '';
            if (lines[i].includes(' : ')) {
                // found a type signature
                typeSignature = lines[i];
                i++; // There will never be a type declaration on its own, the function would follow
            }
            if (lines[i].includes('=') && !/^type alias/.test(lines[i])) {
                // found a function definition - use this if type signature is empty
                functionDefinition = lines[i].substr(0, lines[i].indexOf('='));
            }
            // We found something, add it to the autocomplete/hover results
            if (typeSignature.length + functionDefinition.length > 0) {
                results.push({
                    name: (functionDefinition !== ''
                        ? functionDefinition
                        : typeSignature.split(':')[0])
                        .split(splitOnSpace)[0]
                        .trim(),
                    fullName: functionDefinition !== ''
                        ? functionDefinition
                        : typeSignature
                            .split(':')[0]
                            .split(splitOnSpace)[0]
                            .trim(),
                    signature: typeSignature !== '' ? typeSignature : functionDefinition,
                    href: filename,
                    kind: vscode.CompletionItemKind.Function,
                    comment: (callerFile === null
                        ? '--Function in this file'
                        : '--' + filename) +
                        (typeSignature === '' ? ' (no type signature)' : '') +
                        getFunctionComments(lines.slice(0, i)),
                });
            }
        }
        // Step 4: Search for a type declaration (type alias is later on)
        let suggestionList = [];
        if (!isTypeAlias && /^type (?!alias)/.test(lines[i])) {
            let returnInfo = '';
            let foundCurrentWord = false;
            let typeSignature = '';
            let j = 0;
            if (action === elmOracle_1.OracleAction.IsAutocomplete) {
                suggestionList.push(lines[i]);
                returnInfo = lines[i];
                i++;
            }
            let hoverNameResult = '';
            let hoverTypeSignature = '';
            while (lines[i].trim() !== '' && !lines[i].match(/^module/)) {
                if (action === elmOracle_1.OracleAction.IsAutocomplete) {
                    if (lines[i]
                        .toLowerCase()
                        .includes(currentWord !== '[a-zA-Z]' ? currentWord.toLowerCase() : '')) {
                        foundCurrentWord = true;
                        typeSignature = lines[i];
                        if (typeSignature !== '') {
                            suggestionList.push(typeSignature);
                        }
                    }
                }
                else {
                    try {
                        let words = lines[i].split(/[\s\.\=\:\|]/);
                        let matchingWord = words.filter(word => word !== 'type' &&
                            word !== 'alias' &&
                            word.trim() !== '' &&
                            word.match(/^[a-zA-Z0-9_]/) !== null)[0];
                        if (matchingWord === currentWord) {
                            foundCurrentWord = true;
                            hoverTypeSignature = lines[i];
                            hoverNameResult = matchingWord;
                        }
                    }
                    catch (e) {
                        // word not found
                    }
                }
                returnInfo += '\n' + lines[i];
                j++;
                if (j > config['userProjectMaxCommentSize'] &&
                    config['userProjectMaxCommentSize'] !== 0) {
                    returnInfo +=
                        '\n...(more than ' +
                            (config['userProjectMaxCommentSize'] + 1) +
                            ' lines, see vscode-elm settings)\n';
                    break;
                }
                i++;
            }
            if (action === elmOracle_1.OracleAction.IsAutocomplete) {
                suggestionList.map(item => {
                    results.push({
                        name: (item !== '' ? item : currentWord)
                            .replace('|', '')
                            .replace('=', '')
                            .trim()
                            .split(splitOnSpace)[0]
                            .trim(),
                        fullName: (item !== '' ? item : currentWord)
                            .replace('|', '')
                            .replace('type ', '')
                            .replace('=', '')
                            .trim()
                            .split(splitOnSpace)[0]
                            .trim(),
                        signature: item
                            .replace('|', '')
                            .replace('=', '')
                            .trim(),
                        href: filename,
                        kind: vscode.CompletionItemKind.Enum,
                        comment: returnInfo +
                            getFunctionComments(lines.slice(0, i)) +
                            '\n--' +
                            filename,
                    });
                });
            }
            else if (foundCurrentWord) {
                results.push({
                    name: hoverNameResult
                        .replace('|', '')
                        .replace('=', '')
                        .trim()
                        .split(splitOnSpace)[0]
                        .trim(),
                    fullName: hoverNameResult
                        .replace('|', '')
                        .replace('=', '')
                        .trim()
                        .split(splitOnSpace)[0]
                        .trim(),
                    signature: hoverTypeSignature.replace('|', '').replace('=', ''),
                    href: filename,
                    kind: vscode.CompletionItemKind.Enum,
                    comment: returnInfo +
                        getFunctionComments(lines.slice(0, i)) +
                        '\n--' +
                        filename,
                });
            }
        }
        // Step 5: Look up type aliases
        if (/^(type alias)/.test(lines[i].toLowerCase())) {
            let returnInfo = '';
            suggestionList = [];
            if (toLowerOrHover(action, lines[i]).includes('type alias ' +
                (currentWord !== '[a-zA-Z]'
                    ? toLowerOrHover(action, currentWord)
                    : gOriginalWord.split('.')[1].trim()))) {
                let j = 0;
                returnInfo = lines[i];
                let typeAliasName = lines[i]
                    .replace('type alias ', '')
                    .replace('=', '')
                    .trim();
                while (lines[i].trim() !== '' && !lines[i].match(/^module/)) {
                    i++;
                    returnInfo += '\n' + lines[i];
                    if (action === elmOracle_1.OracleAction.IsAutocomplete) {
                        suggestionList.push(lines[i]);
                    }
                    j++;
                    if (j > config['userProjectMaxCommentSize'] &&
                        config['userProjectMaxCommentSize'] !== 0) {
                        returnInfo +=
                            '\n...(more than ' +
                                (config['userProjectMaxCommentSize'] + 1) +
                                ' lines, see vscode-elm settings)\n';
                        break;
                    }
                }
                // Only include the type alias name in the intellisense results if we are not
                // already looking for the properties of a known type alias (this is reached if
                // the user is typing in a function signature and will suggest Model for example)
                if (isTypeAlias !== true) {
                    results.push({
                        name: typeAliasName,
                        fullName: typeAliasName,
                        signature: 'type alias ' + typeAliasName,
                        href: filename,
                        kind: vscode.CompletionItemKind.Interface,
                        comment: returnInfo +
                            getFunctionComments(lines.slice(0, i)) +
                            '\n--' +
                            filename,
                    });
                }
                // Add intellisense for properties of this type alias
                suggestionList.map(item => {
                    let field = item.split(':')[0];
                    let cleanField = field.replace(/[\{\}\,]/g, '').trim();
                    if (cleanField !== '') {
                        results.push({
                            name: cleanField,
                            fullName: cleanField,
                            signature: item.replace(/[\{\,]/, '').trim(),
                            href: filename,
                            kind: action === elmOracle_1.OracleAction.IsHover
                                ? vscode.CompletionItemKind.Interface
                                : vscode.CompletionItemKind.Property,
                            comment: returnInfo +
                                getFunctionComments(lines.slice(0, i)) +
                                '\n--' +
                                filename,
                        });
                    }
                });
            }
        }
    }
    return results;
}
//# sourceMappingURL=elmUserProject.js.map