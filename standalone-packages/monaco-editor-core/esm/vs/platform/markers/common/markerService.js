/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { isFalsyOrEmpty } from '../../../base/common/arrays';
import { Schemas } from '../../../base/common/network';
import { isEmptyObject } from '../../../base/common/types';
import { Emitter, debounceEvent } from '../../../base/common/event';
import { MarkerSeverity } from './markers';
var MapMap;
(function (MapMap) {
    function get(map, key1, key2) {
        if (map[key1]) {
            return map[key1][key2];
        }
        return undefined;
    }
    MapMap.get = get;
    function set(map, key1, key2, value) {
        if (!map[key1]) {
            map[key1] = Object.create(null);
        }
        map[key1][key2] = value;
    }
    MapMap.set = set;
    function remove(map, key1, key2) {
        if (map[key1] && map[key1][key2]) {
            delete map[key1][key2];
            if (isEmptyObject(map[key1])) {
                delete map[key1];
            }
            return true;
        }
        return false;
    }
    MapMap.remove = remove;
})(MapMap || (MapMap = {}));
var MarkerStats = /** @class */ (function () {
    function MarkerStats(service) {
        this.errors = 0;
        this.infos = 0;
        this.warnings = 0;
        this.unknowns = 0;
        this._data = Object.create(null);
        this._service = service;
        this._subscription = service.onMarkerChanged(this._update, this);
    }
    MarkerStats.prototype.dispose = function () {
        this._subscription.dispose();
        this._data = undefined;
    };
    MarkerStats.prototype._update = function (resources) {
        for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
            var resource = resources_1[_i];
            var key = resource.toString();
            var oldStats = this._data[key];
            if (oldStats) {
                this._substract(oldStats);
            }
            var newStats = this._resourceStats(resource);
            this._add(newStats);
            this._data[key] = newStats;
        }
    };
    MarkerStats.prototype._resourceStats = function (resource) {
        var result = { errors: 0, warnings: 0, infos: 0, unknowns: 0 };
        // TODO this is a hack
        if (resource.scheme === Schemas.inMemory || resource.scheme === Schemas.walkThrough || resource.scheme === Schemas.walkThroughSnippet) {
            return result;
        }
        for (var _i = 0, _a = this._service.read({ resource: resource }); _i < _a.length; _i++) {
            var severity = _a[_i].severity;
            if (severity === MarkerSeverity.Error) {
                result.errors += 1;
            }
            else if (severity === MarkerSeverity.Warning) {
                result.warnings += 1;
            }
            else if (severity === MarkerSeverity.Info) {
                result.infos += 1;
            }
            else {
                result.unknowns += 1;
            }
        }
        return result;
    };
    MarkerStats.prototype._substract = function (op) {
        this.errors -= op.errors;
        this.warnings -= op.warnings;
        this.infos -= op.infos;
        this.unknowns -= op.unknowns;
    };
    MarkerStats.prototype._add = function (op) {
        this.errors += op.errors;
        this.warnings += op.warnings;
        this.infos += op.infos;
        this.unknowns += op.unknowns;
    };
    return MarkerStats;
}());
var MarkerService = /** @class */ (function () {
    function MarkerService() {
        this._onMarkerChanged = new Emitter();
        this._onMarkerChangedEvent = debounceEvent(this._onMarkerChanged.event, MarkerService._debouncer, 0);
        this._byResource = Object.create(null);
        this._byOwner = Object.create(null);
        this._stats = new MarkerStats(this);
    }
    MarkerService.prototype.dispose = function () {
        this._stats.dispose();
    };
    Object.defineProperty(MarkerService.prototype, "onMarkerChanged", {
        get: function () {
            return this._onMarkerChangedEvent;
        },
        enumerable: true,
        configurable: true
    });
    MarkerService.prototype.getStatistics = function () {
        return this._stats;
    };
    MarkerService.prototype.remove = function (owner, resources) {
        if (!isFalsyOrEmpty(resources)) {
            for (var _i = 0, resources_2 = resources; _i < resources_2.length; _i++) {
                var resource = resources_2[_i];
                this.changeOne(owner, resource, undefined);
            }
        }
    };
    MarkerService.prototype.changeOne = function (owner, resource, markerData) {
        if (isFalsyOrEmpty(markerData)) {
            // remove marker for this (owner,resource)-tuple
            var a = MapMap.remove(this._byResource, resource.toString(), owner);
            var b = MapMap.remove(this._byOwner, owner, resource.toString());
            if (a !== b) {
                throw new Error('invalid marker service state');
            }
            if (a && b) {
                this._onMarkerChanged.fire([resource]);
            }
        }
        else {
            // insert marker for this (owner,resource)-tuple
            var markers = [];
            for (var _i = 0, markerData_1 = markerData; _i < markerData_1.length; _i++) {
                var data = markerData_1[_i];
                var marker = MarkerService._toMarker(owner, resource, data);
                if (marker) {
                    markers.push(marker);
                }
            }
            MapMap.set(this._byResource, resource.toString(), owner, markers);
            MapMap.set(this._byOwner, owner, resource.toString(), markers);
            this._onMarkerChanged.fire([resource]);
        }
    };
    MarkerService._toMarker = function (owner, resource, data) {
        var code = data.code, severity = data.severity, message = data.message, source = data.source, startLineNumber = data.startLineNumber, startColumn = data.startColumn, endLineNumber = data.endLineNumber, endColumn = data.endColumn, relatedInformation = data.relatedInformation, tags = data.tags;
        if (!message) {
            return undefined;
        }
        // santize data
        code = code || null;
        startLineNumber = startLineNumber > 0 ? startLineNumber : 1;
        startColumn = startColumn > 0 ? startColumn : 1;
        endLineNumber = endLineNumber >= startLineNumber ? endLineNumber : startLineNumber;
        endColumn = endColumn > 0 ? endColumn : startColumn;
        return {
            resource: resource,
            owner: owner,
            code: code,
            severity: severity,
            message: message,
            source: source,
            startLineNumber: startLineNumber,
            startColumn: startColumn,
            endLineNumber: endLineNumber,
            endColumn: endColumn,
            relatedInformation: relatedInformation,
            tags: tags,
        };
    };
    MarkerService.prototype.changeAll = function (owner, data) {
        var changes = [];
        var map = this._byOwner[owner];
        // remove old marker
        if (map) {
            delete this._byOwner[owner];
            for (var resource in map) {
                // remeber what we remove
                var first = MapMap.get(this._byResource, resource, owner)[0];
                if (first) {
                    changes.push(first.resource);
                }
                // actual remove
                MapMap.remove(this._byResource, resource, owner);
            }
        }
        // add new markers
        if (!isFalsyOrEmpty(data)) {
            // group by resource
            var groups = Object.create(null);
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var _a = data_1[_i], resource = _a.resource, markerData = _a.marker;
                var marker = MarkerService._toMarker(owner, resource, markerData);
                if (!marker) {
                    // filter bad markers
                    continue;
                }
                var array = groups[resource.toString()];
                if (!array) {
                    groups[resource.toString()] = [marker];
                    changes.push(resource);
                }
                else {
                    array.push(marker);
                }
            }
            // insert all
            for (var resource in groups) {
                MapMap.set(this._byResource, resource, owner, groups[resource]);
                MapMap.set(this._byOwner, owner, resource, groups[resource]);
            }
        }
        if (changes.length > 0) {
            this._onMarkerChanged.fire(changes);
        }
    };
    MarkerService.prototype.read = function (filter) {
        if (filter === void 0) { filter = Object.create(null); }
        var owner = filter.owner, resource = filter.resource, severities = filter.severities, take = filter.take;
        if (!take || take < 0) {
            take = -1;
        }
        if (owner && resource) {
            // exactly one owner AND resource
            var data = MapMap.get(this._byResource, resource.toString(), owner);
            if (!data) {
                return [];
            }
            else {
                var result = [];
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var marker = data_2[_i];
                    if (MarkerService._accept(marker, severities)) {
                        var newLen = result.push(marker);
                        if (take > 0 && newLen === take) {
                            break;
                        }
                    }
                }
                return result;
            }
        }
        else if (!owner && !resource) {
            // all
            var result = [];
            for (var key1 in this._byResource) {
                for (var key2 in this._byResource[key1]) {
                    for (var _a = 0, _b = this._byResource[key1][key2]; _a < _b.length; _a++) {
                        var data = _b[_a];
                        if (MarkerService._accept(data, severities)) {
                            var newLen = result.push(data);
                            if (take > 0 && newLen === take) {
                                return result;
                            }
                        }
                    }
                }
            }
            return result;
        }
        else {
            // of one resource OR owner
            var map = owner
                ? this._byOwner[owner]
                : this._byResource[resource.toString()];
            if (!map) {
                return [];
            }
            var result = [];
            for (var key in map) {
                for (var _c = 0, _d = map[key]; _c < _d.length; _c++) {
                    var data = _d[_c];
                    if (MarkerService._accept(data, severities)) {
                        var newLen = result.push(data);
                        if (take > 0 && newLen === take) {
                            return result;
                        }
                    }
                }
            }
            return result;
        }
    };
    MarkerService._accept = function (marker, severities) {
        return severities === void 0 || (severities & marker.severity) === marker.severity;
    };
    MarkerService._debouncer = function (last, event) {
        if (!last) {
            MarkerService._dedupeMap = Object.create(null);
            last = [];
        }
        for (var _i = 0, event_1 = event; _i < event_1.length; _i++) {
            var uri = event_1[_i];
            if (MarkerService._dedupeMap[uri.toString()] === void 0) {
                MarkerService._dedupeMap[uri.toString()] = true;
                last.push(uri);
            }
        }
        return last;
    };
    return MarkerService;
}());
export { MarkerService };
