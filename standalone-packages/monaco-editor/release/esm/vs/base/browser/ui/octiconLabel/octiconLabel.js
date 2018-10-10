/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { escape } from '../../../common/strings.js';
export function renderOcticons(text) {
    return escape(text);
}
var OcticonLabel = /** @class */ (function () {
    function OcticonLabel(container) {
        this._container = container;
    }
    Object.defineProperty(OcticonLabel.prototype, "text", {
        set: function (text) {
            this._container.innerHTML = renderOcticons(text || '');
        },
        enumerable: true,
        configurable: true
    });
    return OcticonLabel;
}());
export { OcticonLabel };
