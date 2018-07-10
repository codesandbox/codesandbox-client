/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Disposable } from '../common/lifecycle';
import { addDisposableListener } from './dom';
/**
 * A helper that will execute a provided function when the provided HTMLElement receives
 *  dragover event for 800ms. If the drag is aborted before, the callback will not be triggered.
 */
var DelayedDragHandler = /** @class */ (function (_super) {
    __extends(DelayedDragHandler, _super);
    function DelayedDragHandler(container, callback) {
        var _this = _super.call(this) || this;
        _this._register(addDisposableListener(container, 'dragover', function () {
            if (!_this.timeout) {
                _this.timeout = setTimeout(function () {
                    callback();
                    _this.timeout = null;
                }, 800);
            }
        }));
        ['dragleave', 'drop', 'dragend'].forEach(function (type) {
            _this._register(addDisposableListener(container, type, function () {
                _this.clearDragTimeout();
            }));
        });
        return _this;
    }
    DelayedDragHandler.prototype.clearDragTimeout = function () {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    DelayedDragHandler.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.clearDragTimeout();
    };
    return DelayedDragHandler;
}(Disposable));
export { DelayedDragHandler };
// Common data transfers
export var DataTransfers = {
    /**
     * Application specific resource transfer type
     */
    RESOURCES: 'ResourceURLs',
    /**
     * Browser specific transfer type to download
     */
    DOWNLOAD_URL: 'DownloadURL',
    /**
     * Browser specific transfer type for files
     */
    FILES: 'Files',
    /**
     * Typicaly transfer type for copy/paste transfers.
     */
    TEXT: 'text/plain'
};
export function applyDragImage(event, label, clazz) {
    var dragImage = document.createElement('div');
    dragImage.className = clazz;
    dragImage.textContent = label;
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, -10, -10);
    // Removes the element when the DND operation is done
    setTimeout(function () { return document.body.removeChild(dragImage); }, 0);
}
