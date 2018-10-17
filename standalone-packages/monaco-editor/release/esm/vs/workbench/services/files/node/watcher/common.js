/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { URI as uri } from '../../../../../base/common/uri.js';
import { FileChangesEvent, isParent } from '../../../../../platform/files/common/files.js';
import { isLinux } from '../../../../../base/common/platform.js';
export function toFileChangesEvent(changes) {
    // map to file changes event that talks about URIs
    return new FileChangesEvent(changes.map(function (c) {
        return {
            type: c.type,
            resource: uri.file(c.path)
        };
    }));
}
/**
 * Given events that occurred, applies some rules to normalize the events
 */
export function normalize(changes) {
    // Build deltas
    var normalizer = new EventNormalizer();
    for (var i = 0; i < changes.length; i++) {
        var event_1 = changes[i];
        normalizer.processEvent(event_1);
    }
    return normalizer.normalize();
}
var EventNormalizer = /** @class */ (function () {
    function EventNormalizer() {
        this.normalized = [];
        this.mapPathToChange = Object.create(null);
    }
    EventNormalizer.prototype.processEvent = function (event) {
        // Event path already exists
        var existingEvent = this.mapPathToChange[event.path];
        if (existingEvent) {
            var currentChangeType = existingEvent.type;
            var newChangeType = event.type;
            // ignore CREATE followed by DELETE in one go
            if (currentChangeType === 1 /* ADDED */ && newChangeType === 2 /* DELETED */) {
                delete this.mapPathToChange[event.path];
                this.normalized.splice(this.normalized.indexOf(existingEvent), 1);
            }
            // flatten DELETE followed by CREATE into CHANGE
            else if (currentChangeType === 2 /* DELETED */ && newChangeType === 1 /* ADDED */) {
                existingEvent.type = 0 /* UPDATED */;
            }
            // Do nothing. Keep the created event
            else if (currentChangeType === 1 /* ADDED */ && newChangeType === 0 /* UPDATED */) {
            }
            // Otherwise apply change type
            else {
                existingEvent.type = newChangeType;
            }
        }
        // Otherwise Store
        else {
            this.normalized.push(event);
            this.mapPathToChange[event.path] = event;
        }
    };
    EventNormalizer.prototype.normalize = function () {
        var addedChangeEvents = [];
        var deletedPaths = [];
        // This algorithm will remove all DELETE events up to the root folder
        // that got deleted if any. This ensures that we are not producing
        // DELETE events for each file inside a folder that gets deleted.
        //
        // 1.) split ADD/CHANGE and DELETED events
        // 2.) sort short deleted paths to the top
        // 3.) for each DELETE, check if there is a deleted parent and ignore the event in that case
        return this.normalized.filter(function (e) {
            if (e.type !== 2 /* DELETED */) {
                addedChangeEvents.push(e);
                return false; // remove ADD / CHANGE
            }
            return true; // keep DELETE
        }).sort(function (e1, e2) {
            return e1.path.length - e2.path.length; // shortest path first
        }).filter(function (e) {
            if (deletedPaths.some(function (d) { return isParent(e.path, d, !isLinux /* ignorecase */); })) {
                return false; // DELETE is ignored if parent is deleted already
            }
            // otherwise mark as deleted
            deletedPaths.push(e.path);
            return true;
        }).concat(addedChangeEvents);
    };
    return EventNormalizer;
}());
