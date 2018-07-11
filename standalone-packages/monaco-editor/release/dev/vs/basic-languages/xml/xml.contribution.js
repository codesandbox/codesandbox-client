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
        id: 'xml',
        extensions: ['.xml', '.dtd', '.ascx', '.csproj', '.config', '.wxi', '.wxl', '.wxs', '.xaml', '.svg', '.svgz'],
        firstLine: '(\\<\\?xml.*)|(\\<svg)|(\\<\\!doctype\\s+svg)',
        aliases: ['XML', 'xml'],
        mimetypes: ['text/xml', 'application/xml', 'application/xaml+xml', 'application/xml-dtd'],
        loader: function () { return _monaco.Promise.wrap(new Promise(function (resolve_1, reject_1) { require(['./xml'], resolve_1, reject_1); })); }
    });
});
