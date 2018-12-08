/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
import { TernarySearchTree } from '../../../../base/common/map.js';
import { realpathSync } from '../../../../base/node/extfs.js';
import { IExtensionService } from '../common/extensions.js';
var ExtensionHostProfiler = /** @class */ (function () {
    function ExtensionHostProfiler(_port, _extensionService) {
        this._port = _port;
        this._extensionService = _extensionService;
    }
    ExtensionHostProfiler.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var profiler, session;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, import('../../../../../v8-inspect-profiler.js')];
                    case 1:
                        profiler = _a.sent();
                        return [4 /*yield*/, profiler.startProfiling({ port: this._port })];
                    case 2:
                        session = _a.sent();
                        return [2 /*return*/, {
                                stop: function () { return __awaiter(_this, void 0, void 0, function () {
                                    var profile, extensions;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, session.stop()];
                                            case 1:
                                                profile = _a.sent();
                                                return [4 /*yield*/, this._extensionService.getExtensions()];
                                            case 2:
                                                extensions = _a.sent();
                                                return [2 /*return*/, this.distill(profile.profile, extensions)];
                                        }
                                    });
                                }); }
                            }];
                }
            });
        });
    };
    ExtensionHostProfiler.prototype.distill = function (profile, extensions) {
        var searchTree = TernarySearchTree.forPaths();
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var extension = extensions_1[_i];
            searchTree.set(realpathSync(extension.extensionLocation.fsPath), extension);
        }
        var nodes = profile.nodes;
        var idsToNodes = new Map();
        var idsToSegmentId = new Map();
        for (var _a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
            var node = nodes_1[_a];
            idsToNodes.set(node.id, node);
        }
        function visit(node, segmentId) {
            if (!segmentId) {
                switch (node.callFrame.functionName) {
                    case '(root)':
                        break;
                    case '(program)':
                        segmentId = 'program';
                        break;
                    case '(garbage collector)':
                        segmentId = 'gc';
                        break;
                    default:
                        segmentId = 'self';
                        break;
                }
            }
            else if (segmentId === 'self' && node.callFrame.url) {
                var extension = searchTree.findSubstr(node.callFrame.url);
                if (extension) {
                    segmentId = extension.id;
                }
            }
            idsToSegmentId.set(node.id, segmentId);
            if (node.children) {
                for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    visit(idsToNodes.get(child), segmentId);
                }
            }
        }
        visit(nodes[0], null);
        var samples = profile.samples;
        var timeDeltas = profile.timeDeltas;
        var distilledDeltas = [];
        var distilledIds = [];
        var currSegmentTime = 0;
        var currSegmentId = void 0;
        for (var i = 0; i < samples.length; i++) {
            var id = samples[i];
            var segmentId = idsToSegmentId.get(id);
            if (segmentId !== currSegmentId) {
                if (currSegmentId) {
                    distilledIds.push(currSegmentId);
                    distilledDeltas.push(currSegmentTime);
                }
                currSegmentId = segmentId;
                currSegmentTime = 0;
            }
            currSegmentTime += timeDeltas[i];
        }
        if (currSegmentId) {
            distilledIds.push(currSegmentId);
            distilledDeltas.push(currSegmentTime);
        }
        idsToNodes = null;
        idsToSegmentId = null;
        searchTree = null;
        return {
            startTime: profile.startTime,
            endTime: profile.endTime,
            deltas: distilledDeltas,
            ids: distilledIds,
            data: profile,
            getAggregatedTimes: function () {
                var segmentsToTime = new Map();
                for (var i = 0; i < distilledIds.length; i++) {
                    var id = distilledIds[i];
                    segmentsToTime.set(id, (segmentsToTime.get(id) || 0) + distilledDeltas[i]);
                }
                return segmentsToTime;
            }
        };
    };
    ExtensionHostProfiler = __decorate([
        __param(1, IExtensionService)
    ], ExtensionHostProfiler);
    return ExtensionHostProfiler;
}());
export { ExtensionHostProfiler };
