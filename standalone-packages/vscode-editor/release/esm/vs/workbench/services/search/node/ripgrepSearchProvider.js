/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { RipgrepTextSearchEngine } from './ripgrepTextSearchEngine.js';
var RipgrepSearchProvider = /** @class */ (function () {
    function RipgrepSearchProvider(outputChannel) {
        var _this = this;
        this.outputChannel = outputChannel;
        this.inProgress = new Set();
        process.once('exit', function () { return _this.dispose(); });
    }
    RipgrepSearchProvider.prototype.provideTextSearchResults = function (query, options, progress, token) {
        var engine = new RipgrepTextSearchEngine(this.outputChannel);
        return this.withToken(token, function (token) { return engine.provideTextSearchResults(query, options, progress, token); });
    };
    RipgrepSearchProvider.prototype.withToken = function (token, fn) {
        return __awaiter(this, void 0, void 0, function () {
            var merged, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        merged = mergedTokenSource(token);
                        this.inProgress.add(merged);
                        return [4 /*yield*/, fn(merged.token)];
                    case 1:
                        result = _a.sent();
                        this.inProgress.delete(merged);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    RipgrepSearchProvider.prototype.dispose = function () {
        this.inProgress.forEach(function (engine) { return engine.cancel(); });
    };
    return RipgrepSearchProvider;
}());
export { RipgrepSearchProvider };
function mergedTokenSource(token) {
    var tokenSource = new CancellationTokenSource();
    token.onCancellationRequested(function () { return tokenSource.cancel(); });
    return tokenSource;
}
