/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Registry } from '../../platform/registry/common/platform';
import { BaseEditor } from './parts/editor/baseEditor';
import { isArray } from '../../base/common/types';
/**
 * A lightweight descriptor of an editor. The descriptor is deferred so that heavy editors
 * can load lazily in the workbench.
 */
var EditorDescriptor = /** @class */ (function () {
    function EditorDescriptor(ctor, id, name) {
        this.ctor = ctor;
        this.id = id;
        this.name = name;
    }
    EditorDescriptor.prototype.instantiate = function (instantiationService) {
        return instantiationService.createInstance(this.ctor);
    };
    EditorDescriptor.prototype.getId = function () {
        return this.id;
    };
    EditorDescriptor.prototype.getName = function () {
        return this.name;
    };
    EditorDescriptor.prototype.describes = function (obj) {
        return obj instanceof BaseEditor && obj.getId() === this.id;
    };
    return EditorDescriptor;
}());
export { EditorDescriptor };
var INPUT_DESCRIPTORS_PROPERTY = '__$inputDescriptors';
var EditorRegistry = /** @class */ (function () {
    function EditorRegistry() {
        this.editors = [];
    }
    EditorRegistry.prototype.registerEditor = function (descriptor, editorInputDescriptor) {
        // Support both non-array and array parameter
        var inputDescriptors = [];
        if (!isArray(editorInputDescriptor)) {
            inputDescriptors.push(editorInputDescriptor);
        }
        else {
            inputDescriptors = editorInputDescriptor;
        }
        // Register (Support multiple Editors per Input)
        descriptor[INPUT_DESCRIPTORS_PROPERTY] = inputDescriptors;
        this.editors.push(descriptor);
    };
    EditorRegistry.prototype.getEditor = function (input) {
        var _this = this;
        var findEditorDescriptors = function (input, byInstanceOf) {
            var matchingDescriptors = [];
            for (var i = 0; i < _this.editors.length; i++) {
                var editor = _this.editors[i];
                var inputDescriptors = editor[INPUT_DESCRIPTORS_PROPERTY];
                for (var j = 0; j < inputDescriptors.length; j++) {
                    var inputClass = inputDescriptors[j].ctor;
                    // Direct check on constructor type (ignores prototype chain)
                    if (!byInstanceOf && input.constructor === inputClass) {
                        matchingDescriptors.push(editor);
                        break;
                    }
                    // Normal instanceof check
                    else if (byInstanceOf && input instanceof inputClass) {
                        matchingDescriptors.push(editor);
                        break;
                    }
                }
            }
            // If no descriptors found, continue search using instanceof and prototype chain
            if (!byInstanceOf && matchingDescriptors.length === 0) {
                return findEditorDescriptors(input, true);
            }
            if (byInstanceOf) {
                return matchingDescriptors;
            }
            return matchingDescriptors;
        };
        var descriptors = findEditorDescriptors(input);
        if (descriptors && descriptors.length > 0) {
            // Ask the input for its preferred Editor
            var preferredEditorId = input.getPreferredEditorId(descriptors.map(function (d) { return d.getId(); }));
            if (preferredEditorId) {
                return this.getEditorById(preferredEditorId);
            }
            // Otherwise, first come first serve
            return descriptors[0];
        }
        return null;
    };
    EditorRegistry.prototype.getEditorById = function (editorId) {
        for (var i = 0; i < this.editors.length; i++) {
            var editor = this.editors[i];
            if (editor.getId() === editorId) {
                return editor;
            }
        }
        return null;
    };
    EditorRegistry.prototype.getEditors = function () {
        return this.editors.slice(0);
    };
    EditorRegistry.prototype.setEditors = function (editorsToSet) {
        this.editors = editorsToSet;
    };
    EditorRegistry.prototype.getEditorInputs = function () {
        var inputClasses = [];
        for (var i = 0; i < this.editors.length; i++) {
            var editor = this.editors[i];
            var editorInputDescriptors = editor[INPUT_DESCRIPTORS_PROPERTY];
            inputClasses.push.apply(inputClasses, editorInputDescriptors.map(function (descriptor) { return descriptor.ctor; }));
        }
        return inputClasses;
    };
    return EditorRegistry;
}());
export var Extensions = {
    Editors: 'workbench.contributions.editors'
};
Registry.add(Extensions.Editors, new EditorRegistry());
