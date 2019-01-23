/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as strings from './strings.js';
import * as paths from './paths.js';
var intlFileNameCollator;
var intlFileNameCollatorIsNumeric;
export function setFileNameComparer(collator) {
    intlFileNameCollator = collator;
    intlFileNameCollatorIsNumeric = collator.resolvedOptions().numeric;
}
export function compareFileNames(one, other, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = false; }
    if (intlFileNameCollator) {
        var a = one || '';
        var b = other || '';
        var result = intlFileNameCollator.compare(a, b);
        // Using the numeric option in the collator will
        // make compare(`foo1`, `foo01`) === 0. We must disambiguate.
        if (intlFileNameCollatorIsNumeric && result === 0 && a !== b) {
            return a < b ? -1 : 1;
        }
        return result;
    }
    return noIntlCompareFileNames(one, other, caseSensitive);
}
var FileNameMatch = /^(.*?)(\.([^.]*))?$/;
export function noIntlCompareFileNames(one, other, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = false; }
    if (!caseSensitive) {
        one = one && one.toLowerCase();
        other = other && other.toLowerCase();
    }
    var _a = extractNameAndExtension(one), oneName = _a[0], oneExtension = _a[1];
    var _b = extractNameAndExtension(other), otherName = _b[0], otherExtension = _b[1];
    if (oneName !== otherName) {
        return oneName < otherName ? -1 : 1;
    }
    if (oneExtension === otherExtension) {
        return 0;
    }
    return oneExtension < otherExtension ? -1 : 1;
}
export function compareFileExtensions(one, other) {
    if (intlFileNameCollator) {
        var _a = extractNameAndExtension(one), oneName = _a[0], oneExtension = _a[1];
        var _b = extractNameAndExtension(other), otherName = _b[0], otherExtension = _b[1];
        var result = intlFileNameCollator.compare(oneExtension, otherExtension);
        if (result === 0) {
            // Using the numeric option in the collator will
            // make compare(`foo1`, `foo01`) === 0. We must disambiguate.
            if (intlFileNameCollatorIsNumeric && oneExtension !== otherExtension) {
                return oneExtension < otherExtension ? -1 : 1;
            }
            // Extensions are equal, compare filenames
            result = intlFileNameCollator.compare(oneName, otherName);
            if (intlFileNameCollatorIsNumeric && result === 0 && oneName !== otherName) {
                return oneName < otherName ? -1 : 1;
            }
        }
        return result;
    }
    return noIntlCompareFileExtensions(one, other);
}
function noIntlCompareFileExtensions(one, other) {
    var _a = extractNameAndExtension(one && one.toLowerCase()), oneName = _a[0], oneExtension = _a[1];
    var _b = extractNameAndExtension(other && other.toLowerCase()), otherName = _b[0], otherExtension = _b[1];
    if (oneExtension !== otherExtension) {
        return oneExtension < otherExtension ? -1 : 1;
    }
    if (oneName === otherName) {
        return 0;
    }
    return oneName < otherName ? -1 : 1;
}
function extractNameAndExtension(str) {
    var match = str ? FileNameMatch.exec(str) : [];
    return [(match && match[1]) || '', (match && match[3]) || ''];
}
function comparePathComponents(one, other, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = false; }
    if (!caseSensitive) {
        one = one && one.toLowerCase();
        other = other && other.toLowerCase();
    }
    if (one === other) {
        return 0;
    }
    return one < other ? -1 : 1;
}
export function comparePaths(one, other, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = false; }
    var oneParts = one.split(paths.nativeSep);
    var otherParts = other.split(paths.nativeSep);
    var lastOne = oneParts.length - 1;
    var lastOther = otherParts.length - 1;
    var endOne, endOther;
    for (var i = 0;; i++) {
        endOne = lastOne === i;
        endOther = lastOther === i;
        if (endOne && endOther) {
            return compareFileNames(oneParts[i], otherParts[i], caseSensitive);
        }
        else if (endOne) {
            return -1;
        }
        else if (endOther) {
            return 1;
        }
        var result = comparePathComponents(oneParts[i], otherParts[i], caseSensitive);
        if (result !== 0) {
            return result;
        }
    }
}
export function compareAnything(one, other, lookFor) {
    var elementAName = one.toLowerCase();
    var elementBName = other.toLowerCase();
    // Sort prefix matches over non prefix matches
    var prefixCompare = compareByPrefix(one, other, lookFor);
    if (prefixCompare) {
        return prefixCompare;
    }
    // Sort suffix matches over non suffix matches
    var elementASuffixMatch = strings.endsWith(elementAName, lookFor);
    var elementBSuffixMatch = strings.endsWith(elementBName, lookFor);
    if (elementASuffixMatch !== elementBSuffixMatch) {
        return elementASuffixMatch ? -1 : 1;
    }
    // Understand file names
    var r = compareFileNames(elementAName, elementBName);
    if (r !== 0) {
        return r;
    }
    // Compare by name
    return elementAName.localeCompare(elementBName);
}
export function compareByPrefix(one, other, lookFor) {
    var elementAName = one.toLowerCase();
    var elementBName = other.toLowerCase();
    // Sort prefix matches over non prefix matches
    var elementAPrefixMatch = strings.startsWith(elementAName, lookFor);
    var elementBPrefixMatch = strings.startsWith(elementBName, lookFor);
    if (elementAPrefixMatch !== elementBPrefixMatch) {
        return elementAPrefixMatch ? -1 : 1;
    }
    // Same prefix: Sort shorter matches to the top to have those on top that match more precisely
    else if (elementAPrefixMatch && elementBPrefixMatch) {
        if (elementAName.length < elementBName.length) {
            return -1;
        }
        if (elementAName.length > elementBName.length) {
            return 1;
        }
    }
    return 0;
}
