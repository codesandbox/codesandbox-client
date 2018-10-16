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
import { URI } from '../../../base/common/uri';
import { Emitter } from '../../../base/common/event';
import { IEnvironmentService } from '../../environment/common/environment';
import { IWorkspaceContextService } from '../../workspace/common/workspace';
import { createDecorator } from '../../instantiation/common/instantiation';
import { isEqual, basenameOrAuthority } from '../../../base/common/resources';
import { isLinux, isWindows } from '../../../base/common/platform';
import { tildify, getPathLabel } from '../../../base/common/labels';
import { ltrim, startsWith } from '../../../base/common/strings';
import { isSingleFolderWorkspaceIdentifier, WORKSPACE_EXTENSION, toWorkspaceIdentifier, isWorkspaceIdentifier } from '../../workspaces/common/workspaces';
import { localize } from '../../../nls';
import { isParent } from '../../files/common/files';
import { basename, dirname, join } from '../../../base/common/paths';
import { Schemas } from '../../../base/common/network';
var LABEL_SERVICE_ID = 'label';
var sepRegexp = /\//g;
var labelMatchingRegexp = /\$\{scheme\}|\$\{authority\}|\$\{path\}/g;
function hasDriveLetter(path) {
    return isWindows && path && path[2] === ':';
}
var LabelService = /** @class */ (function () {
    function LabelService(environmentService, contextService) {
        this.environmentService = environmentService;
        this.contextService = contextService;
        this.formatters = Object.create(null);
        this._onDidRegisterFormatter = new Emitter();
    }
    Object.defineProperty(LabelService.prototype, "onDidRegisterFormatter", {
        get: function () {
            return this._onDidRegisterFormatter.event;
        },
        enumerable: true,
        configurable: true
    });
    LabelService.prototype.findFormatter = function (resource) {
        var path = resource.scheme + "://" + resource.authority;
        var bestPrefix = '';
        for (var prefix in this.formatters) {
            if (startsWith(path, prefix) && prefix.length > bestPrefix.length) {
                bestPrefix = prefix;
            }
        }
        if (bestPrefix.length) {
            return this.formatters[bestPrefix];
        }
        return void 0;
    };
    LabelService.prototype.getUriLabel = function (resource, options) {
        if (options === void 0) { options = {}; }
        if (!resource) {
            return undefined;
        }
        var formatter = this.findFormatter(resource);
        if (!formatter) {
            return getPathLabel(resource.path, this.environmentService, options.relative ? this.contextService : undefined);
        }
        if (options.relative) {
            var baseResource = this.contextService && this.contextService.getWorkspaceFolder(resource);
            if (baseResource) {
                var relativeLabel = void 0;
                if (isEqual(baseResource.uri, resource, !isLinux)) {
                    relativeLabel = ''; // no label if resources are identical
                }
                else {
                    var baseResourceLabel = this.formatUri(baseResource.uri, formatter, options.noPrefix);
                    relativeLabel = ltrim(this.formatUri(resource, formatter, options.noPrefix).substring(baseResourceLabel.length), formatter.uri.separator);
                }
                var hasMultipleRoots = this.contextService.getWorkspace().folders.length > 1;
                if (hasMultipleRoots && !options.noPrefix) {
                    var rootName = (baseResource && baseResource.name) ? baseResource.name : basenameOrAuthority(baseResource.uri);
                    relativeLabel = relativeLabel ? (rootName + ' • ' + relativeLabel) : rootName; // always show root basename if there are multiple
                }
                return relativeLabel;
            }
        }
        return this.formatUri(resource, formatter, options.noPrefix);
    };
    LabelService.prototype.getWorkspaceLabel = function (workspace, options) {
        if (!isWorkspaceIdentifier(workspace) && !isSingleFolderWorkspaceIdentifier(workspace)) {
            workspace = toWorkspaceIdentifier(workspace);
            if (!workspace) {
                return '';
            }
        }
        // Workspace: Single Folder
        if (isSingleFolderWorkspaceIdentifier(workspace)) {
            // Folder on disk
            var formatter = this.findFormatter(workspace);
            var label = options && options.verbose ? this.getUriLabel(workspace) : basenameOrAuthority(workspace);
            if (workspace.scheme === Schemas.file) {
                return label;
            }
            var suffix = formatter && formatter.workspace && (typeof formatter.workspace.suffix === 'string') ? formatter.workspace.suffix : workspace.scheme;
            return suffix ? label + " (" + suffix + ")" : label;
        }
        // Workspace: Untitled
        if (isParent(workspace.configPath, this.environmentService.workspacesHome, !isLinux /* ignore case */)) {
            return localize('untitledWorkspace', "Untitled (Workspace)");
        }
        // Workspace: Saved
        var filename = basename(workspace.configPath);
        var workspaceName = filename.substr(0, filename.length - WORKSPACE_EXTENSION.length - 1);
        if (options && options.verbose) {
            return localize('workspaceNameVerbose', "{0} (Workspace)", this.getUriLabel(URI.file(join(dirname(workspace.configPath), workspaceName))));
        }
        return localize('workspaceName', "{0} (Workspace)", workspaceName);
    };
    LabelService.prototype.registerFormatter = function (selector, formatter) {
        var _this = this;
        this.formatters[selector] = formatter;
        this._onDidRegisterFormatter.fire({ selector: selector, formatter: formatter });
        return {
            dispose: function () { return delete _this.formatters[selector]; }
        };
    };
    LabelService.prototype.formatUri = function (resource, formatter, forceNoTildify) {
        var label = formatter.uri.label.replace(labelMatchingRegexp, function (match) {
            switch (match) {
                case '${scheme}': return resource.scheme;
                case '${authority}': return resource.authority;
                case '${path}': return resource.path;
                default: return '';
            }
        });
        // convert \c:\something => C:\something
        if (formatter.uri.normalizeDriveLetter && hasDriveLetter(label)) {
            label = label.charAt(1).toUpperCase() + label.substr(2);
        }
        if (formatter.uri.tildify && !forceNoTildify) {
            label = tildify(label, this.environmentService.userHome);
        }
        if (formatter.uri.authorityPrefix && resource.authority) {
            label = formatter.uri.authorityPrefix + label;
        }
        return label.replace(sepRegexp, formatter.uri.separator);
    };
    LabelService = __decorate([
        __param(0, IEnvironmentService),
        __param(1, IWorkspaceContextService)
    ], LabelService);
    return LabelService;
}());
export { LabelService };
export var ILabelService = createDecorator(LABEL_SERVICE_ID);
