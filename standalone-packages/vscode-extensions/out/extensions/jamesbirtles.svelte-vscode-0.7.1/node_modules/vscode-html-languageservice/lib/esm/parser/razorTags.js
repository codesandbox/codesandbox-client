/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export function getRazorTagProvider() {
    var customTags = {
        a: ['asp-action', 'asp-controller', 'asp-fragment', 'asp-host', 'asp-protocol', 'asp-route'],
        div: ['asp-validation-summary'],
        form: ['asp-action', 'asp-controller', 'asp-anti-forgery'],
        input: ['asp-for', 'asp-format'],
        label: ['asp-for'],
        select: ['asp-for', 'asp-items'],
        span: ['asp-validation-for']
    };
    return {
        getId: function () { return 'razor'; },
        isApplicable: function (languageId) { return languageId === 'razor'; },
        collectTags: function (collector) {
            // no extra tags
        },
        collectAttributes: function (tag, collector) {
            if (tag) {
                var attributes = customTags[tag];
                if (attributes) {
                    attributes.forEach(function (a) { return collector(a); });
                }
            }
        },
        collectValues: function (tag, attribute, collector) {
            // no values
        }
    };
}
//# sourceMappingURL=razorTags.js.map