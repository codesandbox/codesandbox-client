/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { URI } from '../../../base/common/uri.js';
import { Range } from '../../common/core/range.js';
import { LinkProviderRegistry } from '../../common/modes.js';
import { IModelService } from '../../common/services/modelService.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
var Link = /** @class */ (function () {
    function Link(link, provider) {
        this._link = link;
        this._provider = provider;
    }
    Link.prototype.toJSON = function () {
        return {
            range: this.range,
            url: this.url
        };
    };
    Object.defineProperty(Link.prototype, "range", {
        get: function () {
            return this._link.range;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "url", {
        get: function () {
            return this._link.url;
        },
        enumerable: true,
        configurable: true
    });
    Link.prototype.resolve = function (token) {
        var _this = this;
        if (this._link.url) {
            try {
                return Promise.resolve(URI.parse(this._link.url));
            }
            catch (e) {
                return Promise.reject(new Error('invalid'));
            }
        }
        if (typeof this._provider.resolveLink === 'function') {
            return Promise.resolve(this._provider.resolveLink(this._link, token)).then(function (value) {
                _this._link = value || _this._link;
                if (_this._link.url) {
                    // recurse
                    return _this.resolve(token);
                }
                return Promise.reject(new Error('missing'));
            });
        }
        return Promise.reject(new Error('missing'));
    };
    return Link;
}());
export { Link };
export function getLinks(model, token) {
    var links = [];
    // ask all providers for links in parallel
    var promises = LinkProviderRegistry.ordered(model).reverse().map(function (provider) {
        return Promise.resolve(provider.provideLinks(model, token)).then(function (result) {
            if (Array.isArray(result)) {
                var newLinks = result.map(function (link) { return new Link(link, provider); });
                links = union(links, newLinks);
            }
        }, onUnexpectedExternalError);
    });
    return Promise.all(promises).then(function () {
        return links;
    });
}
function union(oldLinks, newLinks) {
    // reunite oldLinks with newLinks and remove duplicates
    var result = [];
    var oldIndex;
    var oldLen;
    var newIndex;
    var newLen;
    for (oldIndex = 0, newIndex = 0, oldLen = oldLinks.length, newLen = newLinks.length; oldIndex < oldLen && newIndex < newLen;) {
        var oldLink = oldLinks[oldIndex];
        var newLink = newLinks[newIndex];
        if (Range.areIntersectingOrTouching(oldLink.range, newLink.range)) {
            // Remove the oldLink
            oldIndex++;
            continue;
        }
        var comparisonResult = Range.compareRangesUsingStarts(oldLink.range, newLink.range);
        if (comparisonResult < 0) {
            // oldLink is before
            result.push(oldLink);
            oldIndex++;
        }
        else {
            // newLink is before
            result.push(newLink);
            newIndex++;
        }
    }
    for (; oldIndex < oldLen; oldIndex++) {
        result.push(oldLinks[oldIndex]);
    }
    for (; newIndex < newLen; newIndex++) {
        result.push(newLinks[newIndex]);
    }
    return result;
}
CommandsRegistry.registerCommand('_executeLinkProvider', function (accessor) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var uri = args[0];
    if (!(uri instanceof URI)) {
        return undefined;
    }
    var model = accessor.get(IModelService).getModel(uri);
    if (!model) {
        return undefined;
    }
    return getLinks(model, CancellationToken.None);
});
