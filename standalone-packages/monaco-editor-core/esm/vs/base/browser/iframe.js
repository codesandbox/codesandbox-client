/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var hasDifferentOriginAncestorFlag = false;
var sameOriginWindowChainCache = null;
function getParentWindowIfSameOrigin(w) {
    if (!w.parent || w.parent === w) {
        return null;
    }
    // Cannot really tell if we have access to the parent window unless we try to access something in it
    try {
        var location_1 = w.location;
        var parentLocation = w.parent.location;
        if (location_1.protocol !== parentLocation.protocol || location_1.hostname !== parentLocation.hostname || location_1.port !== parentLocation.port) {
            hasDifferentOriginAncestorFlag = true;
            return null;
        }
    }
    catch (e) {
        hasDifferentOriginAncestorFlag = true;
        return null;
    }
    return w.parent;
}
function findIframeElementInParentWindow(parentWindow, childWindow) {
    var parentWindowIframes = parentWindow.document.getElementsByTagName('iframe');
    var iframe;
    for (var i = 0, len = parentWindowIframes.length; i < len; i++) {
        iframe = parentWindowIframes[i];
        if (iframe.contentWindow === childWindow) {
            return iframe;
        }
    }
    return null;
}
var IframeUtils = /** @class */ (function () {
    function IframeUtils() {
    }
    /**
     * Returns a chain of embedded windows with the same origin (which can be accessed programmatically).
     * Having a chain of length 1 might mean that the current execution environment is running outside of an iframe or inside an iframe embedded in a window with a different origin.
     * To distinguish if at one point the current execution environment is running inside a window with a different origin, see hasDifferentOriginAncestor()
     */
    IframeUtils.getSameOriginWindowChain = function () {
        if (!sameOriginWindowChainCache) {
            sameOriginWindowChainCache = [];
            var w = window, parent_1;
            do {
                parent_1 = getParentWindowIfSameOrigin(w);
                if (parent_1) {
                    sameOriginWindowChainCache.push({
                        window: w,
                        iframeElement: findIframeElementInParentWindow(parent_1, w)
                    });
                }
                else {
                    sameOriginWindowChainCache.push({
                        window: w,
                        iframeElement: null
                    });
                }
                w = parent_1;
            } while (w);
        }
        return sameOriginWindowChainCache.slice(0);
    };
    /**
     * Returns true if the current execution environment is chained in a list of iframes which at one point ends in a window with a different origin.
     * Returns false if the current execution environment is not running inside an iframe or if the entire chain of iframes have the same origin.
     */
    IframeUtils.hasDifferentOriginAncestor = function () {
        if (!sameOriginWindowChainCache) {
            this.getSameOriginWindowChain();
        }
        return hasDifferentOriginAncestorFlag;
    };
    /**
     * Returns the position of `childWindow` relative to `ancestorWindow`
     */
    IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow = function (childWindow, ancestorWindow) {
        if (!ancestorWindow || childWindow === ancestorWindow) {
            return {
                top: 0,
                left: 0
            };
        }
        var top = 0, left = 0;
        var windowChain = this.getSameOriginWindowChain();
        for (var i = 0; i < windowChain.length; i++) {
            var windowChainEl = windowChain[i];
            if (windowChainEl.window === ancestorWindow) {
                break;
            }
            if (!windowChainEl.iframeElement) {
                break;
            }
            var boundingRect = windowChainEl.iframeElement.getBoundingClientRect();
            top += boundingRect.top;
            left += boundingRect.left;
        }
        return {
            top: top,
            left: left
        };
    };
    return IframeUtils;
}());
export { IframeUtils };
