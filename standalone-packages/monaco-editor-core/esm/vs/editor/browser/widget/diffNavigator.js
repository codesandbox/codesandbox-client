/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as assert from '../../../base/common/assert';
import * as objects from '../../../base/common/objects';
import { Range } from '../../common/core/range';
import { dispose } from '../../../base/common/lifecycle';
import { Emitter } from '../../../base/common/event';
var defaultOptions = {
    followsCaret: true,
    ignoreCharChanges: true,
    alwaysRevealFirst: true
};
/**
 * Create a new diff navigator for the provided diff editor.
 */
var DiffNavigator = /** @class */ (function () {
    function DiffNavigator(editor, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this._onDidUpdate = new Emitter();
        this.onDidUpdate = this._onDidUpdate.event;
        this._editor = editor;
        this._options = objects.mixin(options, defaultOptions, false);
        this.disposed = false;
        this._disposables = [];
        this.nextIdx = -1;
        this.ranges = [];
        this.ignoreSelectionChange = false;
        this.revealFirst = this._options.alwaysRevealFirst;
        // hook up to diff editor for diff, disposal, and caret move
        this._disposables.push(this._editor.onDidDispose(function () { return _this.dispose(); }));
        this._disposables.push(this._editor.onDidUpdateDiff(function () { return _this._onDiffUpdated(); }));
        if (this._options.followsCaret) {
            this._disposables.push(this._editor.getModifiedEditor().onDidChangeCursorPosition(function (e) {
                if (_this.ignoreSelectionChange) {
                    return;
                }
                _this.nextIdx = -1;
            }));
        }
        if (this._options.alwaysRevealFirst) {
            this._disposables.push(this._editor.getModifiedEditor().onDidChangeModel(function (e) {
                _this.revealFirst = true;
            }));
        }
        // init things
        this._init();
    }
    DiffNavigator.prototype._init = function () {
        var changes = this._editor.getLineChanges();
        if (!changes) {
            return;
        }
    };
    DiffNavigator.prototype._onDiffUpdated = function () {
        this._init();
        this._compute(this._editor.getLineChanges());
        if (this.revealFirst) {
            // Only reveal first on first non-null changes
            if (this._editor.getLineChanges() !== null) {
                this.revealFirst = false;
                this.nextIdx = -1;
                this.next(1 /* Immediate */);
            }
        }
    };
    DiffNavigator.prototype._compute = function (lineChanges) {
        var _this = this;
        // new ranges
        this.ranges = [];
        if (lineChanges) {
            // create ranges from changes
            lineChanges.forEach(function (lineChange) {
                if (!_this._options.ignoreCharChanges && lineChange.charChanges) {
                    lineChange.charChanges.forEach(function (charChange) {
                        _this.ranges.push({
                            rhs: true,
                            range: new Range(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn)
                        });
                    });
                }
                else {
                    _this.ranges.push({
                        rhs: true,
                        range: new Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedStartLineNumber, 1)
                    });
                }
            });
        }
        // sort
        this.ranges.sort(function (left, right) {
            if (left.range.getStartPosition().isBeforeOrEqual(right.range.getStartPosition())) {
                return -1;
            }
            else if (right.range.getStartPosition().isBeforeOrEqual(left.range.getStartPosition())) {
                return 1;
            }
            else {
                return 0;
            }
        });
        this._onDidUpdate.fire(this);
    };
    DiffNavigator.prototype._initIdx = function (fwd) {
        var found = false;
        var position = this._editor.getPosition();
        for (var i = 0, len = this.ranges.length; i < len && !found; i++) {
            var range = this.ranges[i].range;
            if (position.isBeforeOrEqual(range.getStartPosition())) {
                this.nextIdx = i + (fwd ? 0 : -1);
                found = true;
            }
        }
        if (!found) {
            // after the last change
            this.nextIdx = fwd ? 0 : this.ranges.length - 1;
        }
        if (this.nextIdx < 0) {
            this.nextIdx = this.ranges.length - 1;
        }
    };
    DiffNavigator.prototype._move = function (fwd, scrollType) {
        assert.ok(!this.disposed, 'Illegal State - diff navigator has been disposed');
        if (!this.canNavigate()) {
            return;
        }
        if (this.nextIdx === -1) {
            this._initIdx(fwd);
        }
        else if (fwd) {
            this.nextIdx += 1;
            if (this.nextIdx >= this.ranges.length) {
                this.nextIdx = 0;
            }
        }
        else {
            this.nextIdx -= 1;
            if (this.nextIdx < 0) {
                this.nextIdx = this.ranges.length - 1;
            }
        }
        var info = this.ranges[this.nextIdx];
        this.ignoreSelectionChange = true;
        try {
            var pos = info.range.getStartPosition();
            this._editor.setPosition(pos);
            this._editor.revealPositionInCenter(pos, scrollType);
        }
        finally {
            this.ignoreSelectionChange = false;
        }
    };
    DiffNavigator.prototype.canNavigate = function () {
        return this.ranges && this.ranges.length > 0;
    };
    DiffNavigator.prototype.next = function (scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._move(true, scrollType);
    };
    DiffNavigator.prototype.previous = function (scrollType) {
        if (scrollType === void 0) { scrollType = 0 /* Smooth */; }
        this._move(false, scrollType);
    };
    DiffNavigator.prototype.dispose = function () {
        dispose(this._disposables);
        this._disposables.length = 0;
        this._onDidUpdate.dispose();
        this.ranges = null;
        this.disposed = true;
    };
    return DiffNavigator;
}());
export { DiffNavigator };
