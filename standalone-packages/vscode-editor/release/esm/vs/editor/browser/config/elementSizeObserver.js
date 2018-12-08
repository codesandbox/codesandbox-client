/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Disposable } from '../../../base/common/lifecycle.js';
var ElementSizeObserver = /** @class */ (function (_super) {
    __extends(ElementSizeObserver, _super);
    function ElementSizeObserver(referenceDomElement, changeCallback) {
        var _this = _super.call(this) || this;
        _this.referenceDomElement = referenceDomElement;
        _this.changeCallback = changeCallback;
        _this.measureReferenceDomElementToken = -1;
        _this.width = -1;
        _this.height = -1;
        _this.measureReferenceDomElement(false);
        return _this;
    }
    ElementSizeObserver.prototype.dispose = function () {
        this.stopObserving();
        _super.prototype.dispose.call(this);
    };
    ElementSizeObserver.prototype.getWidth = function () {
        return this.width;
    };
    ElementSizeObserver.prototype.getHeight = function () {
        return this.height;
    };
    ElementSizeObserver.prototype.startObserving = function () {
        var _this = this;
        if (this.measureReferenceDomElementToken === -1) {
            this.measureReferenceDomElementToken = setInterval(function () { return _this.measureReferenceDomElement(true); }, 100);
        }
    };
    ElementSizeObserver.prototype.stopObserving = function () {
        if (this.measureReferenceDomElementToken !== -1) {
            clearInterval(this.measureReferenceDomElementToken);
            this.measureReferenceDomElementToken = -1;
        }
    };
    ElementSizeObserver.prototype.observe = function (dimension) {
        this.measureReferenceDomElement(true, dimension);
    };
    ElementSizeObserver.prototype.measureReferenceDomElement = function (callChangeCallback, dimension) {
        var observedWidth = 0;
        var observedHeight = 0;
        if (dimension) {
            observedWidth = dimension.width;
            observedHeight = dimension.height;
        }
        else if (this.referenceDomElement) {
            observedWidth = this.referenceDomElement.clientWidth;
            observedHeight = this.referenceDomElement.clientHeight;
        }
        observedWidth = Math.max(5, observedWidth);
        observedHeight = Math.max(5, observedHeight);
        if (this.width !== observedWidth || this.height !== observedHeight) {
            this.width = observedWidth;
            this.height = observedHeight;
            if (callChangeCallback) {
                this.changeCallback();
            }
        }
    };
    return ElementSizeObserver;
}(Disposable));
export { ElementSizeObserver };
