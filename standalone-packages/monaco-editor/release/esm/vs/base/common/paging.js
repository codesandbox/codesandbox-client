/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { TPromise } from './winjs.base.js';
import { isArray } from './types.js';
export function singlePagePager(elements) {
    return {
        firstPage: elements,
        total: elements.length,
        pageSize: elements.length,
        getPage: null
    };
}
var PagedModel = /** @class */ (function () {
    function PagedModel(arg, pageTimeout) {
        if (pageTimeout === void 0) { pageTimeout = 500; }
        this.pageTimeout = pageTimeout;
        this.pages = [];
        this.pager = isArray(arg) ? singlePagePager(arg) : arg;
        this.pages = [{ isResolved: true, promise: null, promiseIndexes: new Set(), elements: this.pager.firstPage.slice() }];
        var totalPages = Math.ceil(this.pager.total / this.pager.pageSize);
        for (var i = 0, len = totalPages - 1; i < len; i++) {
            this.pages.push({ isResolved: false, promise: null, promiseIndexes: new Set(), elements: [] });
        }
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
    PagedModel.prototype.resolve = function (index) {
        var _this = this;
        var pageIndex = Math.floor(index / this.pager.pageSize);
        var indexInPage = index % this.pager.pageSize;
        var page = this.pages[pageIndex];
        if (page.isResolved) {
            return TPromise.as(page.elements[indexInPage]);
        }
        if (!page.promise) {
            page.promise = TPromise.timeout(this.pageTimeout)
                .then(function () { return _this.pager.getPage(pageIndex); })
                .then(function (elements) {
                page.elements = elements;
                page.isResolved = true;
                page.promise = null;
            }, function (err) {
                page.isResolved = false;
                page.promise = null;
                return TPromise.wrapError(err);
            });
        }
        return new TPromise(function (c, e) {
            page.promiseIndexes.add(index);
            page.promise.done(function () { return c(page.elements[indexInPage]); });
        }, function () {
            if (!page.promise) {
                return;
            }
            page.promiseIndexes.delete(index);
            if (page.promiseIndexes.size === 0) {
                page.promise.cancel();
            }
        });
    };
    return PagedModel;
}());
export { PagedModel };
/**
 * Similar to array.map, `mapPager` lets you map the elements of an
 * abstract paged collection to another type.
 */
export function mapPager(pager, fn) {
    return {
        firstPage: pager.firstPage.map(fn),
        total: pager.total,
        pageSize: pager.pageSize,
        getPage: function (pageIndex) { return pager.getPage(pageIndex).then(function (r) { return r.map(fn); }); }
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
        getPage: function (pageIndex) {
            return TPromise.join([one.getPage(pageIndex), other.getPage(pageIndex)])
                .then(function (_a) {
                var onePage = _a[0], otherPage = _a[1];
                return onePage.concat(otherPage);
            });
        }
    };
}
