/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { URI as uri } from '../../../../base/common/uri.js';
import * as paths from '../../../../base/common/paths.js';
import * as resources from '../../../../base/common/resources.js';
import { DEBUG_SCHEME } from './debug.js';
import { SIDE_GROUP, ACTIVE_GROUP } from '../../../services/editor/common/editorService.js';
import { Schemas } from '../../../../base/common/network.js';
var UNKNOWN_SOURCE_LABEL = nls.localize('unknownSource', "Unknown Source");
/**
 * Debug URI format
 *
 * a debug URI represents a Source object and the debug session where the Source comes from.
 *
 *       debug:arbitrary_path?session=123e4567-e89b-12d3-a456-426655440000&ref=1016
 *       \___/ \____________/ \__________________________________________/ \______/
 *         |          |                             |                          |
 *      scheme   source.path                    session id            source.reference
 *
 * the arbitrary_path and the session id are encoded with 'encodeURIComponent'
 *
 */
var Source = /** @class */ (function () {
    function Source(raw, sessionId) {
        this.raw = raw;
        var path;
        if (!raw) {
            this.raw = { name: UNKNOWN_SOURCE_LABEL };
            this.available = false;
            path = DEBUG_SCHEME + ":" + UNKNOWN_SOURCE_LABEL;
        }
        else {
            path = this.raw.path || this.raw.name;
            this.available = true;
        }
        if (this.raw.sourceReference > 0) {
            this.uri = uri.parse(DEBUG_SCHEME + ":" + encodeURIComponent(path) + "?session=" + encodeURIComponent(sessionId) + "&ref=" + this.raw.sourceReference);
        }
        else {
            if (paths.isAbsolute(path)) {
                this.uri = uri.file(path);
            }
            else {
                // assume that path is a URI
                this.uri = uri.parse(path);
            }
        }
    }
    Object.defineProperty(Source.prototype, "name", {
        get: function () {
            return this.raw.name || resources.basenameOrAuthority(this.uri);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "origin", {
        get: function () {
            return this.raw.origin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "presentationHint", {
        get: function () {
            return this.raw.presentationHint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "reference", {
        get: function () {
            return this.raw.sourceReference;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Source.prototype, "inMemory", {
        get: function () {
            return this.uri.scheme === DEBUG_SCHEME;
        },
        enumerable: true,
        configurable: true
    });
    Source.prototype.openInEditor = function (editorService, selection, preserveFocus, sideBySide, pinned) {
        return !this.available ? Promise.resolve(null) : editorService.openEditor({
            resource: this.uri,
            description: this.origin,
            options: {
                preserveFocus: preserveFocus,
                selection: selection,
                revealIfVisible: true,
                revealInCenterIfOutsideViewport: true,
                pinned: pinned || (!preserveFocus && !this.inMemory)
            }
        }, sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
    };
    Source.getEncodedDebugData = function (modelUri) {
        var path;
        var sourceReference;
        var sessionId;
        switch (modelUri.scheme) {
            case Schemas.file:
                path = paths.normalize(modelUri.fsPath, true);
                break;
            case DEBUG_SCHEME:
                path = modelUri.path;
                if (modelUri.query) {
                    var keyvalues = modelUri.query.split('&');
                    for (var _i = 0, keyvalues_1 = keyvalues; _i < keyvalues_1.length; _i++) {
                        var keyvalue = keyvalues_1[_i];
                        var pair = keyvalue.split('=');
                        if (pair.length === 2) {
                            switch (pair[0]) {
                                case 'session':
                                    sessionId = decodeURIComponent(pair[1]);
                                    break;
                                case 'ref':
                                    sourceReference = parseInt(pair[1]);
                                    break;
                            }
                        }
                    }
                }
                break;
            default:
                path = modelUri.toString();
                break;
        }
        return {
            name: resources.basenameOrAuthority(modelUri),
            path: path,
            sourceReference: sourceReference,
            sessionId: sessionId
        };
    };
    return Source;
}());
export { Source };
