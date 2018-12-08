/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createRotatingLogger } from '../../log/node/spdlogService.js';
var OutputAppender = /** @class */ (function () {
    function OutputAppender(name, file) {
        this.appender = createRotatingLogger(name, file, 1024 * 1024 * 30, 1);
        this.appender.clearFormatters();
    }
    OutputAppender.prototype.append = function (content) {
        this.appender.critical(content);
    };
    OutputAppender.prototype.flush = function () {
        this.appender.flush();
    };
    return OutputAppender;
}());
export { OutputAppender };
