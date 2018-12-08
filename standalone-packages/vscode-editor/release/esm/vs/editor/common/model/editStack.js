/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { onUnexpectedError } from '../../../base/common/errors.js';
var EditStackElement = /** @class */ (function () {
    function EditStackElement(beforeVersionId, beforeCursorState) {
        this.beforeVersionId = beforeVersionId;
        this.beforeCursorState = beforeCursorState;
        this.afterCursorState = null;
        this.afterVersionId = -1;
        this.editOperations = [];
    }
    EditStackElement.prototype.undo = function (model) {
        // Apply all operations in reverse order
        for (var i = this.editOperations.length - 1; i >= 0; i--) {
            this.editOperations[i] = {
                operations: model.applyEdits(this.editOperations[i].operations)
            };
        }
    };
    EditStackElement.prototype.redo = function (model) {
        // Apply all operations
        for (var i = 0; i < this.editOperations.length; i++) {
            this.editOperations[i] = {
                operations: model.applyEdits(this.editOperations[i].operations)
            };
        }
    };
    return EditStackElement;
}());
function getModelEOL(model) {
    var eol = model.getEOL();
    if (eol === '\n') {
        return 0 /* LF */;
    }
    else {
        return 1 /* CRLF */;
    }
}
var EOLStackElement = /** @class */ (function () {
    function EOLStackElement(beforeVersionId, setEOL) {
        this.beforeVersionId = beforeVersionId;
        this.beforeCursorState = null;
        this.afterCursorState = null;
        this.afterVersionId = -1;
        this.eol = setEOL;
    }
    EOLStackElement.prototype.undo = function (model) {
        var redoEOL = getModelEOL(model);
        model.setEOL(this.eol);
        this.eol = redoEOL;
    };
    EOLStackElement.prototype.redo = function (model) {
        var undoEOL = getModelEOL(model);
        model.setEOL(this.eol);
        this.eol = undoEOL;
    };
    return EOLStackElement;
}());
var EditStack = /** @class */ (function () {
    function EditStack(model) {
        this.model = model;
        this.currentOpenStackElement = null;
        this.past = [];
        this.future = [];
    }
    EditStack.prototype.pushStackElement = function () {
        if (this.currentOpenStackElement !== null) {
            this.past.push(this.currentOpenStackElement);
            this.currentOpenStackElement = null;
        }
    };
    EditStack.prototype.clear = function () {
        this.currentOpenStackElement = null;
        this.past = [];
        this.future = [];
    };
    EditStack.prototype.pushEOL = function (eol) {
        // No support for parallel universes :(
        this.future = [];
        if (this.currentOpenStackElement) {
            this.pushStackElement();
        }
        var prevEOL = getModelEOL(this.model);
        var stackElement = new EOLStackElement(this.model.getAlternativeVersionId(), prevEOL);
        this.model.setEOL(eol);
        stackElement.afterVersionId = this.model.getVersionId();
        this.currentOpenStackElement = stackElement;
        this.pushStackElement();
    };
    EditStack.prototype.pushEditOperation = function (beforeCursorState, editOperations, cursorStateComputer) {
        // No support for parallel universes :(
        this.future = [];
        var stackElement = null;
        if (this.currentOpenStackElement) {
            if (this.currentOpenStackElement instanceof EditStackElement) {
                stackElement = this.currentOpenStackElement;
            }
            else {
                this.pushStackElement();
            }
        }
        if (!this.currentOpenStackElement) {
            stackElement = new EditStackElement(this.model.getAlternativeVersionId(), beforeCursorState);
            this.currentOpenStackElement = stackElement;
        }
        var inverseEditOperation = {
            operations: this.model.applyEdits(editOperations)
        };
        stackElement.editOperations.push(inverseEditOperation);
        stackElement.afterCursorState = EditStack._computeCursorState(cursorStateComputer, inverseEditOperation.operations);
        stackElement.afterVersionId = this.model.getVersionId();
        return stackElement.afterCursorState;
    };
    EditStack._computeCursorState = function (cursorStateComputer, inverseEditOperations) {
        try {
            return cursorStateComputer ? cursorStateComputer(inverseEditOperations) : null;
        }
        catch (e) {
            onUnexpectedError(e);
            return null;
        }
    };
    EditStack.prototype.undo = function () {
        this.pushStackElement();
        if (this.past.length > 0) {
            var pastStackElement = this.past.pop();
            try {
                pastStackElement.undo(this.model);
            }
            catch (e) {
                onUnexpectedError(e);
                this.clear();
                return null;
            }
            this.future.push(pastStackElement);
            return {
                selections: pastStackElement.beforeCursorState,
                recordedVersionId: pastStackElement.beforeVersionId
            };
        }
        return null;
    };
    EditStack.prototype.canUndo = function () {
        return (this.past.length > 0);
    };
    EditStack.prototype.redo = function () {
        if (this.future.length > 0) {
            var futureStackElement = this.future.pop();
            try {
                futureStackElement.redo(this.model);
            }
            catch (e) {
                onUnexpectedError(e);
                this.clear();
                return null;
            }
            this.past.push(futureStackElement);
            return {
                selections: futureStackElement.afterCursorState,
                recordedVersionId: futureStackElement.afterVersionId
            };
        }
        return null;
    };
    EditStack.prototype.canRedo = function () {
        return (this.future.length > 0);
    };
    return EditStack;
}());
export { EditStack };
