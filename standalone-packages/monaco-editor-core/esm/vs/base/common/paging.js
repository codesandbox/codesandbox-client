/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from './winjs.base';
import { isArray } from './types';
import { CancellationTokenSource } from './cancellation';
import { canceled } from './errors';
import { range } from './arrays';
function createPage(elements) {
    return {
        isResolved: !!elements,
        promise: null,
        cts: null,
        promiseIndexes: new Set(),
        elements: elements || []
    };
}
export function singlePagePager(elements) {
    return {
        firstPage: elements,
        total: elements.length,
        pageSize: elements.length,
        getPage: null
    };
}
var PagedModel = /** @class */ (function () {
    function PagedModel(arg) {
        this.pages = [];
        this.pager = isArray(arg) ? singlePagePager(arg) : arg;
        var totalPages = Math.ceil(this.pager.total / this.pager.pageSize);
        this.pages = [
            createPage(this.pager.firstPage.slice())
        ].concat(range(totalPages - 1).map(function () { return createPage(); }));
    }
    Object.defineProperty(PagedModel.prototype, "length", {
        get: function () { return this.pager.total; },
        enumerable: true,
        configurable: true
    });
    PagedModel.prototype.isResolved = function (index) {
        var pageIndex = Math.floor(index / this.pager.pageSize);
        var page = this.pages[pageIndex];
        return !!page.isResolved;
    };
    PagedModel.prototype.get = function (index) {
        var pageIndex = Math.floor(index / this.pager.pageSize);
        var indexInPage = index % this.pager.pageSize;
        var page = this.pages[pageIndex];
        return page.elements[indexInPage];
    };
    PagedModel.prototype.resolve = function (index, cancellationToken) {
        if (cancellationToken.isCancellationRequested) {
            return TPromise.wrapError(canceled());
        }
        var pageIndex = Math.floor(index / this.pager.pageSize);
        var indexInPage = index % this.pager.pageSize;
        var page = this.pages[pageIndex];
        if (page.isResolved) {
            return TPromise.as(page.elements[indexInPage]);
        }
        if (!page.promise) {
            page.cts = new CancellationTokenSource();
            page.promise = this.pager.getPage(pageIndex, page.cts.token)
                .then(function (elements) {
                page.elements = elements;
                page.isResolved = true;
                page.promise = null;
                page.cts = null;
            }, function (err) {
                page.isResolved = false;
                page.promise = null;
                page.cts = null;
                return TPromise.wrapError(err);
            });
        }
        cancellationToken.onCancellationRequested(function () {
            if (!page.cts) {
                return;
            }
            page.promiseIndexes.delete(index);
            if (page.promiseIndexes.size === 0) {
                page.cts.cancel();
            }
        });
        page.promiseIndexes.add(index);
        return page.promise.then(function () { return page.elements[indexInPage]; });
    };
    return PagedModel;
}());
export { PagedModel };
var DelayedPagedModel = /** @class */ (function () {
    function DelayedPagedModel(model, timeout) {
        if (timeout === void 0) { timeout = 500; }
        this.model = model;
        this.timeout = timeout;
    }
    Object.defineProperty(DelayedPagedModel.prototype, "length", {
        get: function () { return this.model.length; },
        enumerable: true,
        configurable: true
    });
    DelayedPagedModel.prototype.isResolved = function (index) {
        return this.model.isResolved(index);
    };
    DelayedPagedModel.prototype.get = function (index) {
        return this.model.get(index);
    };
    DelayedPagedModel.prototype.resolve = function (index, cancellationToken) {
        var _this = this;
        return new TPromise(function (c, e) {
            if (cancellationToken.isCancellationRequested) {
                return e(canceled());
            }
            var timer = setTimeout(function () {
                if (cancellationToken.isCancellationRequested) {
                    return e(canceled());
                }
                timeoutCancellation.dispose();
                _this.model.resolve(index, cancellationToken).then(c, e);
            }, _this.timeout);
            var timeoutCancellation = cancellationToken.onCancellationRequested(function () {
                clearTimeout(timer);
                timeoutCancellation.dispose();
                e(canceled());
            });
        });
    };
    return DelayedPagedModel;
}());
export { DelayedPagedModel };
/**
 * Similar to array.map, `mapPager` lets you map the elements of an
 * abstract paged collection to another type.
 */
export function mapPager(pager, fn) {
    return {
        firstPage: pager.firstPage.map(fn),
        total: pager.total,
        pageSize: pager.pageSize,
        getPage: function (pageIndex, token) { return pager.getPage(pageIndex, token).then(function (r) { return r.map(fn); }); }
    };
}
/**
 * Merges two pagers.
 */
export function mergePagers(one, other) {
    return {
        firstPage: one.firstPage.concat(other.firstPage),
        total: one.total + other.total,
        pageSize: one.pageSize + other.pageSize,
        getPage: function (pageIndex, token) {
            return TPromise.join([one.getPage(pageIndex, token), other.getPage(pageIndex, token)])
                .then(function (_a) {
                var onePage = _a[0], otherPage = _a[1];
                return onePage.concat(otherPage);
            });
        }
    };
}
