"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMarkdownDocumentation = exports.markdownDocumentation = exports.tagsMarkdownPreview = exports.plainWithLinks = void 0;
const vscode = require("vscode");
function replaceLinks(text) {
    return text
        // Http(s) links
        .replace(/\{@(link|linkplain|linkcode) (https?:\/\/[^ |}]+?)(?:[| ]([^{}\n]+?))?\}/gi, (_, tag, link, text) => {
        switch (tag) {
            case 'linkcode':
                return `[\`${text ? text.trim() : link}\`](${link})`;
            default:
                return `[${text ? text.trim() : link}](${link})`;
        }
    });
}
function processInlineTags(text) {
    return replaceLinks(text);
}
function getTagBodyText(tag, filePathConverter) {
    if (!tag.text) {
        return undefined;
    }
    // Convert to markdown code block if it does not already contain one
    function makeCodeblock(text) {
        if (text.match(/^\s*[~`]{3}/m)) {
            return text;
        }
        return '```\n' + text + '\n```';
    }
    const text = convertLinkTags(tag.text, filePathConverter);
    switch (tag.name) {
        case 'example':
            // check for caption tags, fix for #79704
            const captionTagMatches = text.match(/<caption>(.*?)<\/caption>\s*(\r\n|\n)/);
            if (captionTagMatches && captionTagMatches.index === 0) {
                return captionTagMatches[1] + '\n' + makeCodeblock(text.substr(captionTagMatches[0].length));
            }
            else {
                return makeCodeblock(text);
            }
        case 'author':
            // fix obsucated email address, #80898
            const emailMatch = text.match(/(.+)\s<([-.\w]+@[-.\w]+)>/);
            if (emailMatch === null) {
                return text;
            }
            else {
                return `${emailMatch[1]} ${emailMatch[2]}`;
            }
        case 'default':
            return makeCodeblock(text);
    }
    return processInlineTags(text);
}
function getTagDocumentation(tag, filePathConverter) {
    switch (tag.name) {
        case 'augments':
        case 'extends':
        case 'param':
        case 'template':
            const body = (convertLinkTags(tag.text, filePathConverter)).split(/^(\S+)\s*-?\s*/);
            if (body?.length === 3) {
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
    const text = getTagBodyText(tag, filePathConverter);
    if (!text) {
        return label;
    }
    return label + (text.match(/\r\n|\n/g) ? '  \n' + text : ` — ${text}`);
}
function plainWithLinks(parts, filePathConverter) {
    return processInlineTags(convertLinkTags(parts, filePathConverter));
}
exports.plainWithLinks = plainWithLinks;
/**
 * Convert `@link` inline tags to markdown links
 */
function convertLinkTags(parts, filePathConverter) {
    if (!parts) {
        return '';
    }
    if (typeof parts === 'string') {
        return parts;
    }
    const out = [];
    let currentLink;
    for (const part of parts) {
        switch (part.kind) {
            case 'link':
                if (currentLink) {
                    if (currentLink.target) {
                        const link = filePathConverter.toResource(currentLink.target.file)
                            .with({
                            fragment: `L${currentLink.target.start.line},${currentLink.target.start.offset}`
                        });
                        const linkText = currentLink.text ? currentLink.text : escapeMarkdownSyntaxTokensForCode(currentLink.name ?? '');
                        out.push(`[${currentLink.linkcode ? '`' + linkText + '`' : linkText}](${link.toString()})`);
                    }
                    else {
                        const text = currentLink.text ?? currentLink.name;
                        if (text) {
                            if (/^https?:/.test(text)) {
                                const parts = text.split(' ');
                                if (parts.length === 1) {
                                    out.push(parts[0]);
                                }
                                else if (parts.length > 1) {
                                    const linkText = escapeMarkdownSyntaxTokensForCode(parts.slice(1).join(' '));
                                    out.push(`[${currentLink.linkcode ? '`' + linkText + '`' : linkText}](${parts[0]})`);
                                }
                            }
                            else {
                                out.push(escapeMarkdownSyntaxTokensForCode(text));
                            }
                        }
                    }
                    currentLink = undefined;
                }
                else {
                    currentLink = {
                        linkcode: part.text === '{@linkcode '
                    };
                }
                break;
            case 'linkName':
                if (currentLink) {
                    currentLink.name = part.text;
                    currentLink.target = part.target;
                }
                break;
            case 'linkText':
                if (currentLink) {
                    currentLink.text = part.text;
                }
                break;
            default:
                out.push(part.text);
                break;
        }
    }
    return processInlineTags(out.join(''));
}
function tagsMarkdownPreview(tags, filePathConverter) {
    return tags.map(tag => getTagDocumentation(tag, filePathConverter)).join('  \n\n');
}
exports.tagsMarkdownPreview = tagsMarkdownPreview;
function markdownDocumentation(documentation, tags, filePathConverter) {
    const out = new vscode.MarkdownString();
    addMarkdownDocumentation(out, documentation, tags, filePathConverter);
    return out;
}
exports.markdownDocumentation = markdownDocumentation;
function addMarkdownDocumentation(out, documentation, tags, converter) {
    if (documentation) {
        out.appendMarkdown(plainWithLinks(documentation, converter));
    }
    if (tags) {
        const tagsPreview = tagsMarkdownPreview(tags, converter);
        if (tagsPreview) {
            out.appendMarkdown('\n\n' + tagsPreview);
        }
    }
    return out;
}
exports.addMarkdownDocumentation = addMarkdownDocumentation;
function escapeMarkdownSyntaxTokensForCode(text) {
    return text.replace(/`/g, '\\$&');
}
//# sourceMappingURL=previewer.js.map