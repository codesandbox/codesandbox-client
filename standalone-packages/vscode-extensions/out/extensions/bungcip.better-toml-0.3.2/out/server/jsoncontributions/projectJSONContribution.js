/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const Strings = require("../utils/strings");
const request_light_1 = require("request-light");
const request_light_2 = require("request-light");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
const FEED_INDEX_URL = 'https://api.nuget.org/v3/index.json';
const LIMIT = 30;
const RESOLVE_ID = 'ProjectJSONContribution-';
const CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes
class ProjectJSONContribution {
    constructor() {
        this.cachedProjects = {};
        this.cacheSize = 0;
    }
    isProjectJSONFile(resource) {
        return Strings.endsWith(resource, '/project.json');
    }
    completeWithCache(id, item) {
        let entry = this.cachedProjects[id];
        if (entry) {
            if (new Date().getTime() - entry.time > CACHE_EXPIRY) {
                delete this.cachedProjects[id];
                this.cacheSize--;
                return false;
            }
            item.detail = entry.version;
            item.documentation = entry.description;
            item.insertText = item.insertText.replace(/\{\{\}\}/, '{{' + entry.version + '}}');
            return true;
        }
        return false;
    }
    addCached(id, version, description) {
        this.cachedProjects[id] = { version, description, time: new Date().getTime() };
        this.cacheSize++;
        if (this.cacheSize > 50) {
            let currentTime = new Date().getTime();
            for (let id in this.cachedProjects) {
                let entry = this.cachedProjects[id];
                if (currentTime - entry.time > CACHE_EXPIRY) {
                    delete this.cachedProjects[id];
                    this.cacheSize--;
                }
            }
        }
    }
    getNugetIndex() {
        if (!this.nugetIndexPromise) {
            this.nugetIndexPromise = this.makeJSONRequest(FEED_INDEX_URL).then(indexContent => {
                let services = {};
                if (indexContent && Array.isArray(indexContent.resources)) {
                    let resources = indexContent.resources;
                    for (let i = resources.length - 1; i >= 0; i--) {
                        let type = resources[i]['@type'];
                        let id = resources[i]['@id'];
                        if (type && id) {
                            services[type] = id;
                        }
                    }
                }
                return services;
            });
        }
        return this.nugetIndexPromise;
    }
    getNugetService(serviceType) {
        return this.getNugetIndex().then(services => {
            let serviceURL = services[serviceType];
            if (!serviceURL) {
                return Promise.reject(localize('json.nugget.error.missingservice', 'NuGet index document is missing service {0}', serviceType));
            }
            return serviceURL;
        });
    }
    collectDefaultCompletions(resource, result) {
        if (this.isProjectJSONFile(resource)) {
            let defaultValue = {
                'version': '{{1.0.0-*}}',
                'dependencies': {},
                'frameworks': {
                    'net461': {},
                    'netcoreapp1.0': {}
                }
            };
            result.add({ kind: vscode_languageserver_1.CompletionItemKind.Class, label: localize('json.project.default', 'Default project.json'), insertText: JSON.stringify(defaultValue, null, '\t'), documentation: '' });
        }
        return null;
    }
    makeJSONRequest(url) {
        return request_light_2.xhr({
            url: url
        }).then(success => {
            if (success.status === 200) {
                try {
                    return JSON.parse(success.responseText);
                }
                catch (e) {
                    return Promise.reject(localize('json.nugget.error.invalidformat', '{0} is not a valid JSON document', url));
                }
            }
            return Promise.reject(localize('json.nugget.error.indexaccess', 'Request to {0} failed: {1}', url, success.responseText));
        }, (error) => {
            return Promise.reject(localize('json.nugget.error.access', 'Request to {0} failed: {1}', url, request_light_1.getErrorStatusDescription(error.status)));
        });
    }
    collectPropertyCompletions(resource, location, currentWord, addValue, isLast, result) {
        if (this.isProjectJSONFile(resource) && (matches(location, ['dependencies']) || matches(location, ['frameworks', '*', 'dependencies']) || matches(location, ['frameworks', '*', 'frameworkAssemblies']))) {
            return this.getNugetService('SearchAutocompleteService').then(service => {
                let queryUrl;
                if (currentWord.length > 0) {
                    queryUrl = service + '?q=' + encodeURIComponent(currentWord) + '&take=' + LIMIT;
                }
                else {
                    queryUrl = service + '?take=' + LIMIT;
                }
                return this.makeJSONRequest(queryUrl).then(resultObj => {
                    if (Array.isArray(resultObj.data)) {
                        let results = resultObj.data;
                        for (let i = 0; i < results.length; i++) {
                            let name = results[i];
                            let insertText = JSON.stringify(name);
                            if (addValue) {
                                insertText += ': "{{}}"';
                                if (!isLast) {
                                    insertText += ',';
                                }
                            }
                            let item = { kind: vscode_languageserver_1.CompletionItemKind.Property, label: name, insertText: insertText, filterText: JSON.stringify(name) };
                            if (!this.completeWithCache(name, item)) {
                                item.data = RESOLVE_ID + name;
                            }
                            result.add(item);
                        }
                        if (results.length === LIMIT) {
                            result.setAsIncomplete();
                        }
                    }
                }, error => {
                    result.error(error);
                });
            }, error => {
                result.error(error);
            });
        }
        ;
        return null;
    }
    collectValueCompletions(resource, location, currentKey, result) {
        if (this.isProjectJSONFile(resource) && (matches(location, ['dependencies']) || matches(location, ['frameworks', '*', 'dependencies']) || matches(location, ['frameworks', '*', 'frameworkAssemblies']))) {
            return this.getNugetService('PackageBaseAddress/3.0.0').then(service => {
                let queryUrl = service + currentKey + '/index.json';
                return this.makeJSONRequest(queryUrl).then(obj => {
                    if (Array.isArray(obj.versions)) {
                        let results = obj.versions;
                        for (let i = 0; i < results.length; i++) {
                            let curr = results[i];
                            let name = JSON.stringify(curr);
                            let label = name;
                            let documentation = '';
                            result.add({ kind: vscode_languageserver_1.CompletionItemKind.Class, label: label, insertText: name, documentation: documentation });
                        }
                        if (results.length === LIMIT) {
                            result.setAsIncomplete();
                        }
                    }
                }, error => {
                    result.error(error);
                });
            }, error => {
                result.error(error);
            });
        }
        return null;
    }
    getInfoContribution(resource, location) {
        if (this.isProjectJSONFile(resource) && (matches(location, ['dependencies', '*']) || matches(location, ['frameworks', '*', 'dependencies', '*']) || matches(location, ['frameworks', '*', 'frameworkAssemblies', '*']))) {
            let pack = location[location.length - 1];
            return this.getNugetService('SearchQueryService').then(service => {
                let queryUrl = service + '?q=' + encodeURIComponent(pack) + '&take=' + 5;
                return this.makeJSONRequest(queryUrl).then(resultObj => {
                    let htmlContent = [];
                    htmlContent.push(localize('json.nugget.package.hover', '{0}', pack));
                    if (Array.isArray(resultObj.data)) {
                        let results = resultObj.data;
                        for (let i = 0; i < results.length; i++) {
                            let res = results[i];
                            this.addCached(res.id, res.version, res.description);
                            if (res.id === pack) {
                                if (res.description) {
                                    htmlContent.push(vscode_languageserver_1.MarkedString.fromPlainText(res.description));
                                }
                                if (res.version) {
                                    htmlContent.push(vscode_languageserver_1.MarkedString.fromPlainText(localize('json.nugget.version.hover', 'Latest version: {0}', res.version)));
                                }
                                break;
                            }
                        }
                    }
                    return htmlContent;
                }, (error) => {
                    return null;
                });
            }, (error) => {
                return null;
            });
        }
        return null;
    }
    resolveSuggestion(item) {
        if (item.data && Strings.startsWith(item.data, RESOLVE_ID)) {
            let pack = item.data.substring(RESOLVE_ID.length);
            if (this.completeWithCache(pack, item)) {
                return Promise.resolve(item);
            }
            return this.getNugetService('SearchQueryService').then(service => {
                let queryUrl = service + '?q=' + encodeURIComponent(pack) + '&take=' + 10;
                return this.makeJSONRequest(queryUrl).then(resultObj => {
                    let itemResolved = false;
                    if (Array.isArray(resultObj.data)) {
                        let results = resultObj.data;
                        for (let i = 0; i < results.length; i++) {
                            let curr = results[i];
                            this.addCached(curr.id, curr.version, curr.description);
                            if (curr.id === pack) {
                                this.completeWithCache(pack, item);
                                itemResolved = true;
                            }
                        }
                    }
                    return itemResolved ? item : null;
                });
            });
        }
        ;
        return null;
    }
}
exports.ProjectJSONContribution = ProjectJSONContribution;
function matches(segments, pattern) {
    let k = 0;
    for (let i = 0; k < pattern.length && i < segments.length; i++) {
        if (pattern[k] === segments[i] || pattern[k] === '*') {
            k++;
        }
        else if (pattern[k] !== '**') {
            return false;
        }
    }
    return k === pattern.length;
}
//# sourceMappingURL=projectJSONContribution.js.map