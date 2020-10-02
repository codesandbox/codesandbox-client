"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.plain = exports.getTagDocumentation = void 0;
function replaceLinks(text) {
    return (text
        // Http(s) links
        .replace(/\{@(link|linkplain|linkcode) (https?:\/\/[^ |}]+?)(?:[| ]([^{}\n]+?))?\}/gi, (_, tag, link, text) => {
        switch (tag) {
            case 'linkcode':
                return `[\`${text ? text.trim() : link}\`](${link})`;
            default:
                return `[${text ? text.trim() : link}](${link})`;
        }
    }));
}
function processInlineTags(text) {
    return replaceLinks(text);
}
function getTagBodyText(tag) {
    if (!tag.text) {
        return undefined;
    }
    // Convert to markdown code block if it is not already one
    function makeCodeblock(text) {
        if (text.match(/^\s*[~`]{3}/g)) {
            return text;
        }
        return '```\n' + text + '\n```';
    }
    switch (tag.name) {
        case 'example':
            // check for caption tags, fix for #79704
            const captionTagMatches = tag.text.match(/<caption>(.*?)<\/caption>\s*(\r\n|\n)/);
            if (captionTagMatches && captionTagMatches.index === 0) {
                return captionTagMatches[1] + '\n\n' + makeCodeblock(tag.text.substr(captionTagMatches[0].length));
            }
            else {
                return makeCodeblock(tag.text);
            }
        case 'author':
            // fix obsucated email address, #80898
            const emailMatch = tag.text.match(/(.+)\s<([-.\w]+@[-.\w]+)>/);
            if (emailMatch === null) {
                return tag.text;
            }
            else {
                return `${emailMatch[1]} ${emailMatch[2]}`;
            }
        case 'default':
            return makeCodeblock(tag.text);
    }
    return processInlineTags(tag.text);
}
function getTagDocumentation(tag) {
    switch (tag.name) {
        case 'augments':
        case 'extends':
        case 'param':
        case 'template':
            const body = (tag.text || '').split(/^(\S+)\s*-?\s*/);
            if ((body === null || body === void 0 ? void 0 : body.length) === 3) {
                const param = body[1];
                const doc = body[2];
                const label = `*@${tag.name}* \`${param}\``;
                if (!doc) {
                    return label;
                }
                return label + (doc.match(/\r\n|\n/g) ? '  \n' + processInlineTags(doc) : ` — ${processInlineTags(doc)}`);
            }
    }
    // Generic tag
    const label = `*@${tag.name}*`;
    const text = getTagBodyText(tag);
    if (!text) {
        return label;
    }
    return label + (text.match(/\r\n|\n/g) ? '  \n' + text : ` — ${text}`);
}
exports.getTagDocumentation = getTagDocumentation;
function plain(parts) {
    return processInlineTags(typeof parts === 'string' ? parts : parts.map(part => part.text).join(''));
}
exports.plain = plain;
//# sourceMappingURL=previewer.js.map