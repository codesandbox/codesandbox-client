/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as platform from '../../registry/common/platform.js';
import { Emitter } from '../../../base/common/event.js';
export var Extensions = {
    JSONContribution: 'base.contributions.json'
};
function normalizeId(id) {
    if (id.length > 0 && id.charAt(id.length - 1) === '#') {
        return id.substring(0, id.length - 1);
    }
    return id;
}
var JSONContributionRegistry = /** @class */ (function () {
    function JSONContributionRegistry() {
        this._onDidChangeSchema = new Emitter();
        this.onDidChangeSchema = this._onDidChangeSchema.event;
        this.schemasById = {};
    }
    JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
        this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
        this._onDidChangeSchema.fire(uri);
    };
    JSONContributionRegistry.prototype.notifySchemaChanged = function (uri) {
        this._onDidChangeSchema.fire(uri);
    };
    JSONContributionRegistry.prototype.getSchemaContributions = function () {
        return {
            schemas: this.schemasById,
        };
    };
    return JSONContributionRegistry;
}());
var jsonContributionRegistry = new JSONContributionRegistry();
platform.Registry.add(Extensions.JSONContribution, jsonContributionRegistry);
