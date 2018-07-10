/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export function getSpaceCnt(str, tabSize) {
    var spacesCnt = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) === '\t') {
            spacesCnt += tabSize;
        }
        else {
            spacesCnt++;
        }
    }
    return spacesCnt;
}
export function generateIndent(spacesCnt, tabSize, insertSpaces) {
    spacesCnt = spacesCnt < 0 ? 0 : spacesCnt;
    var result = '';
    if (!insertSpaces) {
        var tabsCnt = Math.floor(spacesCnt / tabSize);
        spacesCnt = spacesCnt % tabSize;
        for (var i = 0; i < tabsCnt; i++) {
            result += '\t';
        }
    }
    for (var i = 0; i < spacesCnt; i++) {
        result += ' ';
    }
    return result;
}
