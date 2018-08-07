/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
function _encode(ch) {
    return '%' + ch.charCodeAt(0).toString(16).toUpperCase();
}
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function encodeURIComponent2(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, _encode);
}
function encodeNoop(str) {
    return str.replace(/[#?]/, _encode);
}
/**
 * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component paths
 * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 *
 *
 */
var URI = (function () {
    function URI() {
        this._scheme = URI._empty;
        this._authority = URI._empty;
        this._path = URI._empty;
        this._query = URI._empty;
        this._fragment = URI._empty;
        this._formatted = null;
        this._fsPath = null;
    }
    URI.isUri = function (thing) {
        if (thing instanceof URI) {
            return true;
        }
        if (!thing) {
            return false;
        }
        return typeof thing.authority === 'string'
            && typeof thing.fragment === 'string'
            && typeof thing.path === 'string'
            && typeof thing.query === 'string'
            && typeof thing.scheme === 'string';
    };
    Object.defineProperty(URI.prototype, "scheme", {
        /**
         * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
         * The part before the first colon.
         */
        get: function () {
            return this._scheme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "authority", {
        /**
         * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
         * The part between the first double slashes and the next slash.
         */
        get: function () {
            return this._authority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "path", {
        /**
         * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "query", {
        /**
         * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        get: function () {
            return this._query;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "fragment", {
        /**
         * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
         */
        get: function () {
            return this._fragment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URI.prototype, "fsPath", {
        // ---- filesystem path -----------------------
        /**
         * Returns a string representing the corresponding file system path of this URI.
         * Will handle UNC paths and normalize windows drive letters to lower-case. Also
         * uses the platform specific path separator. Will *not* validate the path for
         * invalid characters and semantics. Will *not* look at the scheme of this URI.
         */
        get: function () {
            if (!this._fsPath) {
                var value;
                if (this._authority && this._path && this.scheme === 'file') {
                    // unc path: file://shares/c$/far/boo
                    value = "//" + this._authority + this._path;
                }
                else if (URI._driveLetterPath.test(this._path)) {
                    // windows drive letter: file:///c:/far/boo
                    value = this._path[1].toLowerCase() + this._path.substr(2);
                }
                else {
                    // other path
                    value = this._path;
                }
                if (isWindows) {
                    value = value.replace(/\//g, '\\');
                }
                this._fsPath = value;
            }
            return this._fsPath;
        },
        enumerable: true,
        configurable: true
    });
    // ---- modify to new -------------------------
    URI.prototype.with = function (change) {
        if (!change) {
            return this;
        }
        var scheme = change.scheme, authority = change.authority, path = change.path, query = change.query, fragment = change.fragment;
        if (scheme === void 0) {
            scheme = this.scheme;
        }
        else if (scheme === null) {
            scheme = '';
        }
        if (authority === void 0) {
            authority = this.authority;
        }
        else if (authority === null) {
            authority = '';
        }
        if (path === void 0) {
            path = this.path;
        }
        else if (path === null) {
            path = '';
        }
        if (query === void 0) {
            query = this.query;
        }
        else if (query === null) {
            query = '';
        }
        if (fragment === void 0) {
            fragment = this.fragment;
        }
        else if (fragment === null) {
            fragment = '';
        }
        if (scheme === this.scheme
            && authority === this.authority
            && path === this.path
            && query === this.query
            && fragment === this.fragment) {
            return this;
        }
        var ret = new URI();
        ret._scheme = scheme;
        ret._authority = authority;
        ret._path = path;
        ret._query = query;
        ret._fragment = fragment;
        URI._validate(ret);
        return ret;
    };
    // ---- parse & validate ------------------------
    URI.parse = function (value) {
        var ret = new URI();
        var data = URI._parseComponents(value);
        ret._scheme = data.scheme;
        ret._authority = decodeURIComponent(data.authority);
        ret._path = decodeURIComponent(data.path);
        ret._query = decodeURIComponent(data.query);
        ret._fragment = decodeURIComponent(data.fragment);
        URI._validate(ret);
        return ret;
    };
    URI.file = function (path) {
        var ret = new URI();
        ret._scheme = 'file';
        // normalize to fwd-slashes on windows,
        // on other systems bwd-slaches are valid
        // filename character, eg /f\oo/ba\r.txt
        if (isWindows) {
            path = path.replace(/\\/g, URI._slash);
        }
        // check for authority as used in UNC shares
        // or use the path as given
        if (path[0] === URI._slash && path[0] === path[1]) {
            var idx = path.indexOf(URI._slash, 2);
            if (idx === -1) {
                ret._authority = path.substring(2);
            }
            else {
                ret._authority = path.substring(2, idx);
                ret._path = path.substring(idx);
            }
        }
        else {
            ret._path = path;
        }
        // Ensure that path starts with a slash
        // or that it is at least a slash
        if (ret._path[0] !== URI._slash) {
            ret._path = URI._slash + ret._path;
        }
        URI._validate(ret);
        return ret;
    };
    URI._parseComponents = function (value) {
        var ret = {
            scheme: URI._empty,
            authority: URI._empty,
            path: URI._empty,
            query: URI._empty,
            fragment: URI._empty,
        };
        var match = URI._regexp.exec(value);
        if (match) {
            ret.scheme = match[2] || ret.scheme;
            ret.authority = match[4] || ret.authority;
            ret.path = match[5] || ret.path;
            ret.query = match[7] || ret.query;
            ret.fragment = match[9] || ret.fragment;
        }
        return ret;
    };
    URI.from = function (components) {
        return new URI().with(components);
    };
    URI._validate = function (ret) {
        // scheme, https://tools.ietf.org/html/rfc3986#section-3.1
        // ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
        if (ret.scheme && !URI._schemePattern.test(ret.scheme)) {
            throw new Error('[UriError]: Scheme contains illegal characters.');
        }
        // path, http://tools.ietf.org/html/rfc3986#section-3.3
        // If a URI contains an authority component, then the path component
        // must either be empty or begin with a slash ("/") character.  If a URI
        // does not contain an authority component, then the path cannot begin
        // with two slash characters ("//").
        if (ret.path) {
            if (ret.authority) {
                if (!URI._singleSlashStart.test(ret.path)) {
                    throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
                }
            }
            else {
                if (URI._doubleSlashStart.test(ret.path)) {
                    throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
                }
            }
        }
    };
    // ---- printing/externalize ---------------------------
    /**
     *
     * @param skipEncoding Do not encode the result, default is `false`
     */
    URI.prototype.toString = function (skipEncoding) {
        if (skipEncoding === void 0) { skipEncoding = false; }
        if (!skipEncoding) {
            if (!this._formatted) {
                this._formatted = URI._asFormatted(this, false);
            }
            return this._formatted;
        }
        else {
            // we don't cache that
            return URI._asFormatted(this, true);
        }
    };
    URI._asFormatted = function (uri, skipEncoding) {
        var encoder = !skipEncoding
            ? encodeURIComponent2
            : encodeNoop;
        var parts = [];
        var scheme = uri.scheme, authority = uri.authority, path = uri.path, query = uri.query, fragment = uri.fragment;
        if (scheme) {
            parts.push(scheme, ':');
        }
        if (authority || scheme === 'file') {
            parts.push('//');
        }
        if (authority) {
            authority = authority.toLowerCase();
            var idx = authority.indexOf(':');
            if (idx === -1) {
                parts.push(encoder(authority));
            }
            else {
                parts.push(encoder(authority.substr(0, idx)), authority.substr(idx));
            }
        }
        if (path) {
            // lower-case windows drive letters in /C:/fff or C:/fff
            var m = URI._upperCaseDrive.exec(path);
            if (m) {
                if (m[1]) {
                    path = '/' + m[2].toLowerCase() + path.substr(3); // "/c:".length === 3
                }
                else {
                    path = m[2].toLowerCase() + path.substr(2); // // "c:".length === 2
                }
            }
            // encode every segement but not slashes
            // make sure that # and ? are always encoded
            // when occurring in paths - otherwise the result
            // cannot be parsed back again
            var lastIdx = 0;
            while (true) {
                var idx = path.indexOf(URI._slash, lastIdx);
                if (idx === -1) {
                    parts.push(encoder(path.substring(lastIdx)));
                    break;
                }
                parts.push(encoder(path.substring(lastIdx, idx)), URI._slash);
                lastIdx = idx + 1;
            }
            ;
        }
        if (query) {
            parts.push('?', encoder(query));
        }
        if (fragment) {
            parts.push('#', encoder(fragment));
        }
        return parts.join(URI._empty);
    };
    URI.prototype.toJSON = function () {
        var res = {
            fsPath: this.fsPath,
            external: this.toString(),
            $mid: 1
        };
        if (this.path) {
            res.path = this.path;
        }
        if (this.scheme) {
            res.scheme = this.scheme;
        }
        if (this.authority) {
            res.authority = this.authority;
        }
        if (this.query) {
            res.query = this.query;
        }
        if (this.fragment) {
            res.fragment = this.fragment;
        }
        return res;
    };
    URI.revive = function (data) {
        var result = new URI();
        result._scheme = data.scheme || URI._empty;
        result._authority = data.authority || URI._empty;
        result._path = data.path || URI._empty;
        result._query = data.query || URI._empty;
        result._fragment = data.fragment || URI._empty;
        result._fsPath = data.fsPath;
        result._formatted = data.external;
        URI._validate(result);
        return result;
    };
    return URI;
}());
export default URI;
URI._empty = '';
URI._slash = '/';
URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
URI._driveLetterPath = /^\/[a-zA-z]:/;
URI._upperCaseDrive = /^(\/)?([A-Z]:)/;
URI._schemePattern = /^\w[\w\d+.-]*$/;
URI._singleSlashStart = /^\//;
URI._doubleSlashStart = /^\/\//;
var isWindows;
if (typeof process === 'object') {
    isWindows = process.platform === 'win32';
}
else if (typeof navigator === 'object') {
    var userAgent = navigator.userAgent;
    isWindows = userAgent.indexOf('Windows') >= 0;
}
