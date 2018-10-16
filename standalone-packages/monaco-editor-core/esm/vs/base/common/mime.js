/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as paths from './paths';
import * as strings from './strings';
import { match } from './glob';
export var MIME_TEXT = 'text/plain';
export var MIME_BINARY = 'application/octet-stream';
export var MIME_UNKNOWN = 'application/unknown';
var registeredAssociations = [];
var nonUserRegisteredAssociations = [];
var userRegisteredAssociations = [];
/**
 * Associate a text mime to the registry.
 */
export function registerTextMime(association, warnOnOverwrite) {
    if (warnOnOverwrite === void 0) { warnOnOverwrite = false; }
    // Register
    var associationItem = toTextMimeAssociationItem(association);
    registeredAssociations.push(associationItem);
    if (!associationItem.userConfigured) {
        nonUserRegisteredAssociations.push(associationItem);
    }
    else {
        userRegisteredAssociations.push(associationItem);
    }
    // Check for conflicts unless this is a user configured association
    if (warnOnOverwrite && !associationItem.userConfigured) {
        registeredAssociations.forEach(function (a) {
            if (a.mime === associationItem.mime || a.userConfigured) {
                return; // same mime or userConfigured is ok
            }
            if (associationItem.extension && a.extension === associationItem.extension) {
                console.warn("Overwriting extension <<" + associationItem.extension + ">> to now point to mime <<" + associationItem.mime + ">>");
            }
            if (associationItem.filename && a.filename === associationItem.filename) {
                console.warn("Overwriting filename <<" + associationItem.filename + ">> to now point to mime <<" + associationItem.mime + ">>");
            }
            if (associationItem.filepattern && a.filepattern === associationItem.filepattern) {
                console.warn("Overwriting filepattern <<" + associationItem.filepattern + ">> to now point to mime <<" + associationItem.mime + ">>");
            }
            if (associationItem.firstline && a.firstline === associationItem.firstline) {
                console.warn("Overwriting firstline <<" + associationItem.firstline + ">> to now point to mime <<" + associationItem.mime + ">>");
            }
        });
    }
}
function toTextMimeAssociationItem(association) {
    return {
        id: association.id,
        mime: association.mime,
        filename: association.filename,
        extension: association.extension,
        filepattern: association.filepattern,
        firstline: association.firstline,
        userConfigured: association.userConfigured,
        filenameLowercase: association.filename ? association.filename.toLowerCase() : void 0,
        extensionLowercase: association.extension ? association.extension.toLowerCase() : void 0,
        filepatternLowercase: association.filepattern ? association.filepattern.toLowerCase() : void 0,
        filepatternOnPath: association.filepattern ? association.filepattern.indexOf(paths.sep) >= 0 : false
    };
}
/**
 * Clear text mimes from the registry.
 */
export function clearTextMimes(onlyUserConfigured) {
    if (!onlyUserConfigured) {
        registeredAssociations = [];
        nonUserRegisteredAssociations = [];
        userRegisteredAssociations = [];
    }
    else {
        registeredAssociations = registeredAssociations.filter(function (a) { return !a.userConfigured; });
        userRegisteredAssociations = [];
    }
}
/**
 * Given a file, return the best matching mime type for it
 */
export function guessMimeTypes(path, firstLine) {
    if (!path) {
        return [MIME_UNKNOWN];
    }
    path = path.toLowerCase();
    var filename = paths.basename(path);
    // 1.) User configured mappings have highest priority
    var configuredMime = guessMimeTypeByPath(path, filename, userRegisteredAssociations);
    if (configuredMime) {
        return [configuredMime, MIME_TEXT];
    }
    // 2.) Registered mappings have middle priority
    var registeredMime = guessMimeTypeByPath(path, filename, nonUserRegisteredAssociations);
    if (registeredMime) {
        return [registeredMime, MIME_TEXT];
    }
    // 3.) Firstline has lowest priority
    if (firstLine) {
        var firstlineMime = guessMimeTypeByFirstline(firstLine);
        if (firstlineMime) {
            return [firstlineMime, MIME_TEXT];
        }
    }
    return [MIME_UNKNOWN];
}
function guessMimeTypeByPath(path, filename, associations) {
    var filenameMatch;
    var patternMatch;
    var extensionMatch;
    // We want to prioritize associations based on the order they are registered so that the last registered
    // association wins over all other. This is for https://github.com/Microsoft/vscode/issues/20074
    for (var i = associations.length - 1; i >= 0; i--) {
        var association = associations[i];
        // First exact name match
        if (filename === association.filenameLowercase) {
            filenameMatch = association;
            break; // take it!
        }
        // Longest pattern match
        if (association.filepattern) {
            if (!patternMatch || association.filepattern.length > patternMatch.filepattern.length) {
                var target = association.filepatternOnPath ? path : filename; // match on full path if pattern contains path separator
                if (match(association.filepatternLowercase, target)) {
                    patternMatch = association;
                }
            }
        }
        // Longest extension match
        if (association.extension) {
            if (!extensionMatch || association.extension.length > extensionMatch.extension.length) {
                if (strings.endsWith(filename, association.extensionLowercase)) {
                    extensionMatch = association;
                }
            }
        }
    }
    // 1.) Exact name match has second highest prio
    if (filenameMatch) {
        return filenameMatch.mime;
    }
    // 2.) Match on pattern
    if (patternMatch) {
        return patternMatch.mime;
    }
    // 3.) Match on extension comes next
    if (extensionMatch) {
        return extensionMatch.mime;
    }
    return null;
}
function guessMimeTypeByFirstline(firstLine) {
    if (strings.startsWithUTF8BOM(firstLine)) {
        firstLine = firstLine.substr(1);
    }
    if (firstLine.length > 0) {
        for (var i = 0; i < registeredAssociations.length; ++i) {
            var association = registeredAssociations[i];
            if (!association.firstline) {
                continue;
            }
            var matches = firstLine.match(association.firstline);
            if (matches && matches.length > 0) {
                return association.mime;
            }
        }
    }
    return null;
}
export function isUnspecific(mime) {
    if (!mime) {
        return true;
    }
    if (typeof mime === 'string') {
        return mime === MIME_BINARY || mime === MIME_TEXT || mime === MIME_UNKNOWN;
    }
    return mime.length === 1 && isUnspecific(mime[0]);
}
export function suggestFilename(langId, prefix) {
    for (var i = 0; i < registeredAssociations.length; i++) {
        var association = registeredAssociations[i];
        if (association.userConfigured) {
            continue; // only support registered ones
        }
        if (association.id === langId && association.extension) {
            return prefix + association.extension;
        }
    }
    return prefix; // without any known extension, just return the prefix
}
// Known media mimes that we can handle
var mapExtToMediaMimes = {
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpg',
    '.jpe': 'image/jpg',
    '.png': 'image/png',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.ico': 'image/x-icon',
    '.tga': 'image/x-tga',
    '.psd': 'image/vnd.adobe.photoshop',
    '.webp': 'image/webp',
    '.mid': 'audio/midi',
    '.midi': 'audio/midi',
    '.mp4a': 'audio/mp4',
    '.mpga': 'audio/mpeg',
    '.mp2': 'audio/mpeg',
    '.mp2a': 'audio/mpeg',
    '.mp3': 'audio/mpeg',
    '.m2a': 'audio/mpeg',
    '.m3a': 'audio/mpeg',
    '.oga': 'audio/ogg',
    '.ogg': 'audio/ogg',
    '.spx': 'audio/ogg',
    '.aac': 'audio/x-aac',
    '.wav': 'audio/x-wav',
    '.wma': 'audio/x-ms-wma',
    '.mp4': 'video/mp4',
    '.mp4v': 'video/mp4',
    '.mpg4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.mpg': 'video/mpeg',
    '.mpe': 'video/mpeg',
    '.m1v': 'video/mpeg',
    '.m2v': 'video/mpeg',
    '.ogv': 'video/ogg',
    '.qt': 'video/quicktime',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
    '.mk3d': 'video/x-matroska',
    '.mks': 'video/x-matroska',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.avi': 'video/x-msvideo',
    '.movie': 'video/x-sgi-movie'
};
export function getMediaMime(path) {
    var ext = paths.extname(path);
    return mapExtToMediaMimes[ext.toLowerCase()];
}
