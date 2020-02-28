/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export var browserNames = {
    E: 'Edge',
    FF: 'Firefox',
    S: 'Safari',
    C: 'Chrome',
    IE: 'IE',
    O: 'Opera'
};
function getEntryStatus(status) {
    switch (status) {
        case 'experimental':
            return '⚠️ Property is experimental. Be cautious when using it.️\n\n';
        case 'nonstandard':
            return '🚨️ Property is nonstandard. Avoid using it.\n\n';
        case 'obsolete':
            return '🚨️️️ Property is obsolete. Avoid using it.\n\n';
        default:
            return '';
    }
}
export function getEntryDescription(entry) {
    if (!entry.description || entry.description === '') {
        return null;
    }
    var result = '';
    if (entry.status) {
        result += getEntryStatus(entry.status);
    }
    result += entry.description;
    var browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        result += '\n(' + browserLabel + ')';
    }
    if ('syntax' in entry) {
        result += "\n\nSyntax: " + entry.syntax;
    }
    return result;
}
/**
 * Input is like `["E12","FF49","C47","IE","O"]`
 * Output is like `Edge 12, Firefox 49, Chrome 47, IE, Opera`
 */
export function getBrowserLabel(browsers) {
    if (!browsers || browsers.length === 0) {
        return null;
    }
    return browsers
        .map(function (b) {
        var result = '';
        var matches = b.match(/([A-Z]+)(\d+)?/);
        var name = matches[1];
        var version = matches[2];
        if (name in browserNames) {
            result += browserNames[name];
        }
        if (version) {
            result += ' ' + version;
        }
        return result;
    })
        .join(', ');
}
