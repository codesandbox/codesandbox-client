var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
define(["require", "exports", "./lib/typescriptServices"], function (require, exports, ts) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    function splitPath(filename) {
        return splitPathRe.exec(filename).slice(1);
    }
    // resolves . and .. elements in a path array with directory names there
    // must be no slashes or device names (c:\) in the array
    // (so also no leading and trailing slashes - it does not distinguish
    // relative and absolute paths)
    function normalizeArray(parts, allowAboveRoot) {
        var res = [];
        for (var i = 0; i < parts.length; i += 1) {
            var p = parts[i];
            // ignore empty parts
            if (!p || p === '.')
                continue; // eslint-disable-line no-continue
            if (p === '..') {
                if (res.length && res[res.length - 1] !== '..') {
                    res.pop();
                }
                else if (allowAboveRoot) {
                    res.push('..');
                }
            }
            else {
                res.push(p);
            }
        }
        return res;
    }
    function isAbsolute(path) {
        return path.charAt(0) === '/';
    }
    exports.isAbsolute = isAbsolute;
    function normalize(path) {
        var isAbs = isAbsolute(path);
        var trailingSlash = path && path[path.length - 1] === '/';
        var newPath = path;
        // Normalize the path
        newPath = normalizeArray(newPath.split('/'), !isAbs).join('/');
        if (!newPath && !isAbs) {
            newPath = '.';
        }
        if (newPath && trailingSlash) {
            newPath += '/';
        }
        return (isAbs ? '/' : '') + newPath;
    }
    exports.normalize = normalize;
    function join() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var path = '';
        for (var i = 0; i < paths.length; i += 1) {
            var segment = paths[i];
            if (typeof segment !== 'string') {
                throw new TypeError('Arguments to path.join must be strings');
            }
            if (segment) {
                if (!path) {
                    path += segment;
                }
                else {
                    path += "/" + segment;
                }
            }
        }
        return normalize(path);
    }
    exports.join = join;
    function dirname(path) {
        var result = splitPath(path);
        var root = result[0];
        var dir = result[1];
        if (!root && !dir) {
            // No dirname whatsoever
            return '.';
        }
        if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
    }
    exports.dirname = dirname;
    function basename(p, ext) {
        if (ext === void 0) { ext = ''; }
        // Special case: Normalize will modify this to '.'
        if (p === '') {
            return p;
        }
        // Normalize the string first to remove any weirdness.
        var path = normalize(p);
        // Get the last part of the string.
        var sections = path.split('/');
        var lastPart = sections[sections.length - 1];
        // Special case: If it's empty, then we have a string like so: foo/
        // Meaning, 'foo' is guaranteed to be a directory.
        if (lastPart === '' && sections.length > 1) {
            return sections[sections.length - 2];
        }
        // Remove the extension, if need be.
        if (ext.length > 0) {
            var lastPartExt = lastPart.substr(lastPart.length - ext.length);
            if (lastPartExt === ext) {
                return lastPart.substr(0, lastPart.length - ext.length);
            }
        }
        return lastPart;
    }
    exports.basename = basename;
    function absolute(path) {
        if (path.indexOf('/') === 0) {
            return path;
        }
        if (path.indexOf('./') === 0) {
            return path.replace('./', '/');
        }
        return '/' + path;
    }
    exports.absolute = absolute;
    var ROOT_URL = "https://cdn.jsdelivr.net/";
    var loadedTypings = [];
    /**
     * Send the typings library to the editor, the editor can then add them to the
     * registry
     * @param {string} virtualPath Path of typings
     * @param {string} typings Typings
     */
    var addLib = function (virtualPath, typings, fetchedPaths) {
        fetchedPaths[virtualPath] = typings;
    };
    var fetchCache = new Map();
    var doFetch = function (url) {
        var cached = fetchCache.get(url);
        if (cached) {
            return cached;
        }
        var promise = fetch(url)
            .then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response);
            }
            var error = new Error(response.statusText || "" + response.status);
            // @ts-ignore
            error.response = response;
            return Promise.reject(error);
        })
            .then(function (response) { return response.text(); });
        fetchCache.set(url, promise);
        return promise;
    };
    var fetchFromDefinitelyTyped = function (dependency, version, fetchedPaths) {
        var depUrl = ROOT_URL + "npm/@types/" + dependency
            .replace('@', '')
            .replace(/\//g, '__');
        return doFetch(depUrl + "/package.json").then(function (typings) { return __awaiter(_this, void 0, void 0, function () {
            var rootVirtualPath, referencedPath;
            return __generator(this, function (_a) {
                rootVirtualPath = "node_modules/@types/" + dependency;
                referencedPath = rootVirtualPath + "/package.json";
                addLib(referencedPath, typings, fetchedPaths);
                // const typeVersion = await doFetch(`${depUrl}/package.json`).then(res => {
                //   const packagePath = `${rootVirtualPath}/package.json`;
                //   addLib(packagePath, res, fetchedPaths);
                //   return JSON.parse(res).version;
                // })
                // get all files in the specified directory
                return [2 /*return*/, getFileMetaData("@types/" + dependency, JSON.parse(typings).version, '/').then(function (fileData) {
                        return getFileTypes(depUrl, "@types/" + dependency, '/index.d.ts', fetchedPaths, fileData);
                    })];
            });
        }); });
    };
    var getRequireStatements = function (title, code) {
        var requires = [];
        var sourceFile = ts.createSourceFile(title, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        // Check the reference comments
        sourceFile.referencedFiles.forEach(function (ref) {
            requires.push(ref.fileName);
        });
        ts.forEachChild(sourceFile, function (node) {
            switch (node.kind) {
                case ts.SyntaxKind.ImportDeclaration: {
                    // @ts-ignore
                    if (node.moduleSpecifier) {
                        // @ts-ignore
                        requires.push(node.moduleSpecifier.text);
                    }
                    break;
                }
                case ts.SyntaxKind.ExportDeclaration: {
                    // For syntax 'export ... from '...'''
                    // @ts-ignore
                    if (node.moduleSpecifier) {
                        // @ts-ignore
                        requires.push(node.moduleSpecifier.text);
                    }
                    break;
                }
                default: {
                    /* */
                }
            }
        });
        return requires;
    };
    var tempTransformFiles = function (files) {
        var finalObj = {};
        files.forEach(function (d) {
            finalObj[d.name] = d;
        });
        return finalObj;
    };
    var transformFiles = function (dir) {
        return dir.files
            ? dir.files.reduce(function (prev, next) {
                var _a;
                if (next.type === 'file') {
                    return __assign({}, prev, (_a = {}, _a[next.path] = next, _a));
                }
                return __assign({}, prev, transformFiles(next));
            }, {})
            : {};
    };
    var getFileMetaData = function (dependency, version, depPath) {
        return doFetch("https://data.jsdelivr.com/v1/package/npm/" + dependency + "@" + version + "/flat")
            .then(function (response) { return JSON.parse(response); })
            .then(function (response) { return response.files.filter(function (f) { return f.name.startsWith(depPath); }); })
            .then(tempTransformFiles);
    };
    var resolveAppropiateFile = function (fileMetaData, relativePath) {
        var absolutePath = "/" + relativePath;
        if (fileMetaData[absolutePath + ".d.ts"])
            return relativePath + ".d.ts";
        if (fileMetaData[absolutePath + ".ts"])
            return relativePath + ".ts";
        if (fileMetaData[absolutePath])
            return relativePath;
        if (fileMetaData[absolutePath + "/index.d.ts"])
            return relativePath + "/index.d.ts";
        return relativePath;
    };
    var getFileTypes = function (depUrl, dependency, depPath, fetchedPaths, fileMetaData) {
        var virtualPath = join('node_modules', dependency, depPath);
        if (fetchedPaths[virtualPath])
            return null;
        return doFetch(depUrl + "/" + depPath).then(function (typings) {
            if (fetchedPaths[virtualPath])
                return null;
            addLib(virtualPath, typings, fetchedPaths);
            // Now find all require statements, so we can download those types too
            return Promise.all(getRequireStatements(depPath, typings)
                .filter(
            // Don't add global deps
            function (dep) { return dep.startsWith('.'); })
                .map(function (relativePath) { return join(dirname(depPath), relativePath); })
                .map(function (relativePath) { return resolveAppropiateFile(fileMetaData, relativePath); })
                .map(function (nextDepPath) {
                return getFileTypes(depUrl, dependency, nextDepPath, fetchedPaths, fileMetaData);
            }));
        });
    };
    function fetchFromMeta(dependency, version, fetchedPaths) {
        var depUrl = "https://data.jsdelivr.com/v1/package/npm/" + dependency + "@" + version + "/flat";
        return doFetch(depUrl)
            .then(function (response) { return JSON.parse(response); })
            .then(function (meta) {
            var filterAndFlatten = function (files, filter) {
                return files.reduce(function (paths, file) {
                    if (filter.test(file.name)) {
                        paths.push(file.name);
                    }
                    return paths;
                }, []);
            };
            var dtsFiles = filterAndFlatten(meta.files, /\.d\.ts$/);
            if (dtsFiles.length === 0) {
                // if no .d.ts files found, fallback to .ts files
                dtsFiles = filterAndFlatten(meta.files, /\.ts$/);
            }
            if (dtsFiles.length === 0) {
                throw new Error('No inline typings found.');
            }
            return Promise.all(dtsFiles.map(function (file) {
                return doFetch("https://cdn.jsdelivr.net/npm/" + dependency + "@" + version + file)
                    .then(function (dtsFile) {
                    return addLib("node_modules/" + dependency + file, dtsFile, fetchedPaths);
                })
                    .catch(function () { });
            }));
        });
    }
    function fetchFromTypings(dependency, version, fetchedPaths) {
        var depUrl = ROOT_URL + "npm/" + dependency + "@" + version;
        return doFetch(depUrl + "/package.json")
            .then(function (response) { return JSON.parse(response); })
            .then(function (packageJSON) {
            var types = packageJSON.typings || packageJSON.types;
            if (types) {
                // Add package.json, since this defines where all types lie
                addLib("node_modules/" + dependency + "/package.json", JSON.stringify(packageJSON), fetchedPaths);
                // get all files in the specified directory
                return getFileMetaData(dependency, version, join('/', dirname(types))).then(function (fileData) {
                    return getFileTypes(depUrl, dependency, resolveAppropiateFile(fileData, types), fetchedPaths, fileData);
                });
            }
            throw new Error('No typings field in package.json');
        });
    }
    function fetchAndAddDependencies(dependencies, onDependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchedPaths, depNames;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchedPaths = {};
                        depNames = Object.keys(dependencies);
                        return [4 /*yield*/, Promise.all(depNames.map(function (dep) { return __awaiter(_this, void 0, void 0, function () {
                                var depVersion_1, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 4, , 5]);
                                            if (!(loadedTypings.indexOf(dep) === -1)) return [3 /*break*/, 3];
                                            loadedTypings.push(dep);
                                            return [4 /*yield*/, doFetch("https://data.jsdelivr.com/v1/package/resolve/npm/" + dep + "@" + dependencies[dep])
                                                    .then(function (x) { return JSON.parse(x); })
                                                    .then(function (x) { return x.version; })];
                                        case 1:
                                            depVersion_1 = _a.sent();
                                            // eslint-disable-next-line no-await-in-loop
                                            return [4 /*yield*/, fetchFromTypings(dep, depVersion_1, fetchedPaths).catch(function () {
                                                    // not available in package.json, try checking meta for inline .d.ts files
                                                    return fetchFromMeta(dep, depVersion_1, fetchedPaths).catch(function () {
                                                        // Not available in package.json or inline from meta, try checking in @types/
                                                        return fetchFromDefinitelyTyped(dep, depVersion_1, fetchedPaths);
                                                    });
                                                })];
                                        case 2:
                                            // eslint-disable-next-line no-await-in-loop
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [3 /*break*/, 5];
                                        case 4:
                                            e_1 = _a.sent();
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        onDependencies(fetchedPaths);
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.fetchAndAddDependencies = fetchAndAddDependencies;
});
