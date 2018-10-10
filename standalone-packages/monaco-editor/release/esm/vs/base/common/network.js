/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export var Schemas;
(function (Schemas) {
    /**
     * A schema that is used for models that exist in memory
     * only and that have no correspondence on a server or such.
     */
    Schemas.inMemory = 'inmemory';
    /**
     * A schema that is used for setting files
     */
    Schemas.vscode = 'vscode';
    /**
     * A schema that is used for internal private files
     */
    Schemas.internal = 'private';
    /**
     * A walk-through document.
     */
    Schemas.walkThrough = 'walkThrough';
    /**
     * An embedded code snippet.
     */
    Schemas.walkThroughSnippet = 'walkThroughSnippet';
    Schemas.http = 'http';
    Schemas.https = 'https';
    Schemas.file = 'file';
    Schemas.mailto = 'mailto';
    Schemas.untitled = 'untitled';
    Schemas.data = 'data';
})(Schemas || (Schemas = {}));
