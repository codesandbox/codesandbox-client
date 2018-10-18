define(["require", "exports", "../_.contribution"], function (require, exports, __contribution_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Allow for running under nodejs/requirejs in tests
    var _monaco = (typeof monaco === 'undefined' ? self.monaco : monaco);
    __contribution_1.registerLanguage({
        id: 'c',
        extensions: ['.c', '.h'],
        aliases: ['C', 'c'],
        loader: function () { return _monaco.Promise.wrap(new Promise(function (resolve_1, reject_1) { require(['./cpp'], resolve_1, reject_1); })); }
    });
    __contribution_1.registerLanguage({
        id: 'cpp',
        extensions: ['.cpp', '.cc', '.cxx', '.hpp', '.hh', '.hxx'],
        aliases: ['C++', 'Cpp', 'cpp'],
        loader: function () { return _monaco.Promise.wrap(new Promise(function (resolve_2, reject_2) { require(['./cpp'], resolve_2, reject_2); })); }
    });
});
