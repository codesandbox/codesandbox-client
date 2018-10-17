/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _a;
var Scanner = /** @class */ (function () {
    function Scanner() {
        this.text('');
    }
    Scanner.isDigitCharacter = function (ch) {
        return ch >= 48 /* Digit0 */ && ch <= 57 /* Digit9 */;
    };
    Scanner.isVariableCharacter = function (ch) {
        return ch === 95 /* Underline */
            || (ch >= 97 /* a */ && ch <= 122 /* z */)
            || (ch >= 65 /* A */ && ch <= 90 /* Z */);
    };
    Scanner.prototype.text = function (value) {
        this.value = value;
        this.pos = 0;
    };
    Scanner.prototype.tokenText = function (token) {
        return this.value.substr(token.pos, token.len);
    };
    Scanner.prototype.next = function () {
        if (this.pos >= this.value.length) {
            return { type: 14 /* EOF */, pos: this.pos, len: 0 };
        }
        var pos = this.pos;
        var len = 0;
        var ch = this.value.charCodeAt(pos);
        var type;
        // static types
        type = Scanner._table[ch];
        if (typeof type === 'number') {
            this.pos += 1;
            return { type: type, pos: pos, len: 1 };
        }
        // number
        if (Scanner.isDigitCharacter(ch)) {
            type = 8 /* Int */;
            do {
                len += 1;
                ch = this.value.charCodeAt(pos + len);
            } while (Scanner.isDigitCharacter(ch));
            this.pos += len;
            return { type: type, pos: pos, len: len };
        }
        // variable name
        if (Scanner.isVariableCharacter(ch)) {
            type = 9 /* VariableName */;
            do {
                ch = this.value.charCodeAt(pos + (++len));
            } while (Scanner.isVariableCharacter(ch) || Scanner.isDigitCharacter(ch));
            this.pos += len;
            return { type: type, pos: pos, len: len };
        }
        // format
        type = 10 /* Format */;
        do {
            len += 1;
            ch = this.value.charCodeAt(pos + len);
        } while (!isNaN(ch)
            && typeof Scanner._table[ch] === 'undefined' // not static token
            && !Scanner.isDigitCharacter(ch) // not number
            && !Scanner.isVariableCharacter(ch) // not variable
        );
        this.pos += len;
        return { type: type, pos: pos, len: len };
    };
    Scanner._table = (_a = {},
        _a[36 /* DollarSign */] = 0 /* Dollar */,
        _a[58 /* Colon */] = 1 /* Colon */,
        _a[44 /* Comma */] = 2 /* Comma */,
        _a[123 /* OpenCurlyBrace */] = 3 /* CurlyOpen */,
        _a[125 /* CloseCurlyBrace */] = 4 /* CurlyClose */,
        _a[92 /* Backslash */] = 5 /* Backslash */,
        _a[47 /* Slash */] = 6 /* Forwardslash */,
        _a[124 /* Pipe */] = 7 /* Pipe */,
        _a[43 /* Plus */] = 11 /* Plus */,
        _a[45 /* Dash */] = 12 /* Dash */,
        _a[63 /* QuestionMark */] = 13 /* QuestionMark */,
        _a);
    return Scanner;
}());
export { Scanner };
var Marker = /** @class */ (function () {
    function Marker() {
        this._children = [];
    }
    Marker.prototype.appendChild = function (child) {
        if (child instanceof Text && this._children[this._children.length - 1] instanceof Text) {
            // this and previous child are text -> merge them
            this._children[this._children.length - 1].value += child.value;
        }
        else {
            // normal adoption of child
            child.parent = this;
            this._children.push(child);
        }
        return this;
    };
    Marker.prototype.replace = function (child, others) {
        var parent = child.parent;
        var idx = parent.children.indexOf(child);
        var newChildren = parent.children.slice(0);
        newChildren.splice.apply(newChildren, [idx, 1].concat(others));
        parent._children = newChildren;
        (function _fixParent(children, parent) {
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child_1 = children_1[_i];
                child_1.parent = parent;
                _fixParent(child_1.children, child_1);
            }
        })(others, parent);
    };
    Object.defineProperty(Marker.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "snippet", {
        get: function () {
            var candidate = this;
            while (true) {
                if (!candidate) {
                    return undefined;
                }
                if (candidate instanceof TextmateSnippet) {
                    return candidate;
                }
                candidate = candidate.parent;
            }
        },
        enumerable: true,
        configurable: true
    });
    Marker.prototype.toString = function () {
        return this.children.reduce(function (prev, cur) { return prev + cur.toString(); }, '');
    };
    Marker.prototype.len = function () {
        return 0;
    };
    return Marker;
}());
export { Marker };
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(value) {
        var _this_1 = _super.call(this) || this;
        _this_1.value = value;
        return _this_1;
    }
    Text.escape = function (value) {
        return value.replace(/\$|}|\\/g, '\\$&');
    };
    Text.prototype.toString = function () {
        return this.value;
    };
    Text.prototype.toTextmateString = function () {
        return Text.escape(this.value);
    };
    Text.prototype.len = function () {
        return this.value.length;
    };
    Text.prototype.clone = function () {
        return new Text(this.value);
    };
    return Text;
}(Marker));
export { Text };
var TransformableMarker = /** @class */ (function (_super) {
    __extends(TransformableMarker, _super);
    function TransformableMarker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TransformableMarker;
}(Marker));
export { TransformableMarker };
var Placeholder = /** @class */ (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder(index) {
        var _this_1 = _super.call(this) || this;
        _this_1.index = index;
        return _this_1;
    }
    Placeholder.compareByIndex = function (a, b) {
        if (a.index === b.index) {
            return 0;
        }
        else if (a.isFinalTabstop) {
            return 1;
        }
        else if (b.isFinalTabstop) {
            return -1;
        }
        else if (a.index < b.index) {
            return -1;
        }
        else if (a.index > b.index) {
            return 1;
        }
        else {
            return 0;
        }
    };
    Object.defineProperty(Placeholder.prototype, "isFinalTabstop", {
        get: function () {
            return this.index === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Placeholder.prototype, "choice", {
        get: function () {
            return this._children.length === 1 && this._children[0] instanceof Choice
                ? this._children[0]
                : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Placeholder.prototype.toTextmateString = function () {
        var transformString = '';
        if (this.transform) {
            transformString = this.transform.toTextmateString();
        }
        if (this.children.length === 0 && !this.transform) {
            return "$" + this.index;
        }
        else if (this.children.length === 0) {
            return "${" + this.index + transformString + "}";
        }
        else if (this.choice) {
            return "${" + this.index + "|" + this.choice.toTextmateString() + "|" + transformString + "}";
        }
        else {
            return "${" + this.index + ":" + this.children.map(function (child) { return child.toTextmateString(); }).join('') + transformString + "}";
        }
    };
    Placeholder.prototype.clone = function () {
        var ret = new Placeholder(this.index);
        if (this.transform) {
            ret.transform = this.transform.clone();
        }
        ret._children = this.children.map(function (child) { return child.clone(); });
        return ret;
    };
    return Placeholder;
}(TransformableMarker));
export { Placeholder };
var Choice = /** @class */ (function (_super) {
    __extends(Choice, _super);
    function Choice() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.options = [];
        return _this_1;
    }
    Choice.prototype.appendChild = function (marker) {
        if (marker instanceof Text) {
            marker.parent = this;
            this.options.push(marker);
        }
        return this;
    };
    Choice.prototype.toString = function () {
        return this.options[0].value;
    };
    Choice.prototype.toTextmateString = function () {
        return this.options
            .map(function (option) { return option.value.replace(/\||,/g, '\\$&'); })
            .join(',');
    };
    Choice.prototype.len = function () {
        return this.options[0].len();
    };
    Choice.prototype.clone = function () {
        var ret = new Choice();
        this.options.forEach(ret.appendChild, ret);
        return ret;
    };
    return Choice;
}(Marker));
export { Choice };
var Transform = /** @class */ (function (_super) {
    __extends(Transform, _super);
    function Transform() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transform.prototype.resolve = function (value) {
        var _this = this;
        var didMatch = false;
        var ret = value.replace(this.regexp, function () {
            didMatch = true;
            return _this._replace(Array.prototype.slice.call(arguments, 0, -2));
        });
        // when the regex didn't match and when the transform has
        // else branches, then run those
        if (!didMatch && this._children.some(function (child) { return child instanceof FormatString && Boolean(child.elseValue); })) {
            ret = this._replace([]);
        }
        return ret;
    };
    Transform.prototype._replace = function (groups) {
        var ret = '';
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var marker = _a[_i];
            if (marker instanceof FormatString) {
                var value = groups[marker.index] || '';
                value = marker.resolve(value);
                ret += value;
            }
            else {
                ret += marker.toString();
            }
        }
        return ret;
    };
    Transform.prototype.toString = function () {
        return '';
    };
    Transform.prototype.toTextmateString = function () {
        return "/" + this.regexp.source + "/" + this.children.map(function (c) { return c.toTextmateString(); }) + "/" + ((this.regexp.ignoreCase ? 'i' : '') + (this.regexp.global ? 'g' : ''));
    };
    Transform.prototype.clone = function () {
        var ret = new Transform();
        ret.regexp = new RegExp(this.regexp.source, '' + (this.regexp.ignoreCase ? 'i' : '') + (this.regexp.global ? 'g' : ''));
        ret._children = this.children.map(function (child) { return child.clone(); });
        return ret;
    };
    return Transform;
}(Marker));
export { Transform };
var FormatString = /** @class */ (function (_super) {
    __extends(FormatString, _super);
    function FormatString(index, shorthandName, ifValue, elseValue) {
        var _this_1 = _super.call(this) || this;
        _this_1.index = index;
        _this_1.shorthandName = shorthandName;
        _this_1.ifValue = ifValue;
        _this_1.elseValue = elseValue;
        return _this_1;
    }
    FormatString.prototype.resolve = function (value) {
        if (this.shorthandName === 'upcase') {
            return !value ? '' : value.toLocaleUpperCase();
        }
        else if (this.shorthandName === 'downcase') {
            return !value ? '' : value.toLocaleLowerCase();
        }
        else if (this.shorthandName === 'capitalize') {
            return !value ? '' : (value[0].toLocaleUpperCase() + value.substr(1));
        }
        else if (this.shorthandName === 'pascalcase') {
            return !value ? '' : this._toPascalCase(value);
        }
        else if (Boolean(value) && typeof this.ifValue === 'string') {
            return this.ifValue;
        }
        else if (!Boolean(value) && typeof this.elseValue === 'string') {
            return this.elseValue;
        }
        else {
            return value || '';
        }
    };
    FormatString.prototype._toPascalCase = function (value) {
        return value.match(/[a-z]+/gi)
            .map(function (word) {
            return word.charAt(0).toUpperCase()
                + word.substr(1).toLowerCase();
        })
            .join('');
    };
    FormatString.prototype.toTextmateString = function () {
        var value = '${';
        value += this.index;
        if (this.shorthandName) {
            value += ":/" + this.shorthandName;
        }
        else if (this.ifValue && this.elseValue) {
            value += ":?" + this.ifValue + ":" + this.elseValue;
        }
        else if (this.ifValue) {
            value += ":+" + this.ifValue;
        }
        else if (this.elseValue) {
            value += ":-" + this.elseValue;
        }
        value += '}';
        return value;
    };
    FormatString.prototype.clone = function () {
        var ret = new FormatString(this.index, this.shorthandName, this.ifValue, this.elseValue);
        return ret;
    };
    return FormatString;
}(Marker));
export { FormatString };
var Variable = /** @class */ (function (_super) {
    __extends(Variable, _super);
    function Variable(name) {
        var _this_1 = _super.call(this) || this;
        _this_1.name = name;
        return _this_1;
    }
    Variable.prototype.resolve = function (resolver) {
        var value = resolver.resolve(this);
        if (this.transform) {
            value = this.transform.resolve(value || '');
        }
        if (value !== undefined) {
            this._children = [new Text(value)];
            return true;
        }
        return false;
    };
    Variable.prototype.toTextmateString = function () {
        var transformString = '';
        if (this.transform) {
            transformString = this.transform.toTextmateString();
        }
        if (this.children.length === 0) {
            return "${" + this.name + transformString + "}";
        }
        else {
            return "${" + this.name + ":" + this.children.map(function (child) { return child.toTextmateString(); }).join('') + transformString + "}";
        }
    };
    Variable.prototype.clone = function () {
        var ret = new Variable(this.name);
        if (this.transform) {
            ret.transform = this.transform.clone();
        }
        ret._children = this.children.map(function (child) { return child.clone(); });
        return ret;
    };
    return Variable;
}(TransformableMarker));
export { Variable };
function walk(marker, visitor) {
    var stack = marker.slice();
    while (stack.length > 0) {
        var marker_1 = stack.shift();
        var recurse = visitor(marker_1);
        if (!recurse) {
            break;
        }
        stack.unshift.apply(stack, marker_1.children);
    }
}
var TextmateSnippet = /** @class */ (function (_super) {
    __extends(TextmateSnippet, _super);
    function TextmateSnippet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(TextmateSnippet.prototype, "placeholderInfo", {
        get: function () {
            if (!this._placeholders) {
                // fill in placeholders
                var all_1 = [];
                var last_1;
                this.walk(function (candidate) {
                    if (candidate instanceof Placeholder) {
                        all_1.push(candidate);
                        last_1 = !last_1 || last_1.index < candidate.index ? candidate : last_1;
                    }
                    return true;
                });
                this._placeholders = { all: all_1, last: last_1 };
            }
            return this._placeholders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextmateSnippet.prototype, "placeholders", {
        get: function () {
            var all = this.placeholderInfo.all;
            return all;
        },
        enumerable: true,
        configurable: true
    });
    TextmateSnippet.prototype.offset = function (marker) {
        var pos = 0;
        var found = false;
        this.walk(function (candidate) {
            if (candidate === marker) {
                found = true;
                return false;
            }
            pos += candidate.len();
            return true;
        });
        if (!found) {
            return -1;
        }
        return pos;
    };
    TextmateSnippet.prototype.fullLen = function (marker) {
        var ret = 0;
        walk([marker], function (marker) {
            ret += marker.len();
            return true;
        });
        return ret;
    };
    TextmateSnippet.prototype.enclosingPlaceholders = function (placeholder) {
        var ret = [];
        var parent = placeholder.parent;
        while (parent) {
            if (parent instanceof Placeholder) {
                ret.push(parent);
            }
            parent = parent.parent;
        }
        return ret;
    };
    TextmateSnippet.prototype.resolveVariables = function (resolver) {
        var _this_1 = this;
        this.walk(function (candidate) {
            if (candidate instanceof Variable) {
                if (candidate.resolve(resolver)) {
                    _this_1._placeholders = undefined;
                }
            }
            return true;
        });
        return this;
    };
    TextmateSnippet.prototype.appendChild = function (child) {
        this._placeholders = undefined;
        return _super.prototype.appendChild.call(this, child);
    };
    TextmateSnippet.prototype.replace = function (child, others) {
        this._placeholders = undefined;
        return _super.prototype.replace.call(this, child, others);
    };
    TextmateSnippet.prototype.toTextmateString = function () {
        return this.children.reduce(function (prev, cur) { return prev + cur.toTextmateString(); }, '');
    };
    TextmateSnippet.prototype.clone = function () {
        var ret = new TextmateSnippet();
        this._children = this.children.map(function (child) { return child.clone(); });
        return ret;
    };
    TextmateSnippet.prototype.walk = function (visitor) {
        walk(this.children, visitor);
    };
    return TextmateSnippet;
}(Marker));
export { TextmateSnippet };
var SnippetParser = /** @class */ (function () {
    function SnippetParser() {
        this._scanner = new Scanner();
    }
    SnippetParser.escape = function (value) {
        return value.replace(/\$|}|\\/g, '\\$&');
    };
    SnippetParser.prototype.text = function (value) {
        return this.parse(value).toString();
    };
    SnippetParser.prototype.parse = function (value, insertFinalTabstop, enforceFinalTabstop) {
        this._scanner.text(value);
        this._token = this._scanner.next();
        var snippet = new TextmateSnippet();
        while (this._parse(snippet)) {
            // nothing
        }
        // fill in values for placeholders. the first placeholder of an index
        // that has a value defines the value for all placeholders with that index
        var placeholderDefaultValues = new Map();
        var incompletePlaceholders = [];
        var placeholderCount = 0;
        snippet.walk(function (marker) {
            if (marker instanceof Placeholder) {
                placeholderCount += 1;
                if (marker.isFinalTabstop) {
                    placeholderDefaultValues.set(0, undefined);
                }
                else if (!placeholderDefaultValues.has(marker.index) && marker.children.length > 0) {
                    placeholderDefaultValues.set(marker.index, marker.children);
                }
                else {
                    incompletePlaceholders.push(marker);
                }
            }
            return true;
        });
        for (var _i = 0, incompletePlaceholders_1 = incompletePlaceholders; _i < incompletePlaceholders_1.length; _i++) {
            var placeholder = incompletePlaceholders_1[_i];
            if (placeholderDefaultValues.has(placeholder.index)) {
                var clone = new Placeholder(placeholder.index);
                clone.transform = placeholder.transform;
                for (var _a = 0, _b = placeholderDefaultValues.get(placeholder.index); _a < _b.length; _a++) {
                    var child = _b[_a];
                    clone.appendChild(child.clone());
                }
                snippet.replace(placeholder, [clone]);
            }
        }
        if (!enforceFinalTabstop) {
            enforceFinalTabstop = placeholderCount > 0 && insertFinalTabstop;
        }
        if (!placeholderDefaultValues.has(0) && enforceFinalTabstop) {
            // the snippet uses placeholders but has no
            // final tabstop defined -> insert at the end
            snippet.appendChild(new Placeholder(0));
        }
        return snippet;
    };
    SnippetParser.prototype._accept = function (type, value) {
        if (type === undefined || this._token.type === type) {
            var ret = !value ? true : this._scanner.tokenText(this._token);
            this._token = this._scanner.next();
            return ret;
        }
        return false;
    };
    SnippetParser.prototype._backTo = function (token) {
        this._scanner.pos = token.pos + token.len;
        this._token = token;
        return false;
    };
    SnippetParser.prototype._until = function (type) {
        if (this._token.type === 14 /* EOF */) {
            return false;
        }
        var start = this._token;
        while (this._token.type !== type) {
            this._token = this._scanner.next();
            if (this._token.type === 14 /* EOF */) {
                return false;
            }
        }
        var value = this._scanner.value.substring(start.pos, this._token.pos);
        this._token = this._scanner.next();
        return value;
    };
    SnippetParser.prototype._parse = function (marker) {
        return this._parseEscaped(marker)
            || this._parseTabstopOrVariableName(marker)
            || this._parseComplexPlaceholder(marker)
            || this._parseComplexVariable(marker)
            || this._parseAnything(marker);
    };
    // \$, \\, \} -> just text
    SnippetParser.prototype._parseEscaped = function (marker) {
        var value;
        if (value = this._accept(5 /* Backslash */, true)) {
            // saw a backslash, append escaped token or that backslash
            value = this._accept(0 /* Dollar */, true)
                || this._accept(4 /* CurlyClose */, true)
                || this._accept(5 /* Backslash */, true)
                || value;
            marker.appendChild(new Text(value));
            return true;
        }
        return false;
    };
    // $foo -> variable, $1 -> tabstop
    SnippetParser.prototype._parseTabstopOrVariableName = function (parent) {
        var value;
        var token = this._token;
        var match = this._accept(0 /* Dollar */)
            && (value = this._accept(9 /* VariableName */, true) || this._accept(8 /* Int */, true));
        if (!match) {
            return this._backTo(token);
        }
        parent.appendChild(/^\d+$/.test(value)
            ? new Placeholder(Number(value))
            : new Variable(value));
        return true;
    };
    // ${1:<children>}, ${1} -> placeholder
    SnippetParser.prototype._parseComplexPlaceholder = function (parent) {
        var index;
        var token = this._token;
        var match = this._accept(0 /* Dollar */)
            && this._accept(3 /* CurlyOpen */)
            && (index = this._accept(8 /* Int */, true));
        if (!match) {
            return this._backTo(token);
        }
        var placeholder = new Placeholder(Number(index));
        if (this._accept(1 /* Colon */)) {
            // ${1:<children>}
            while (true) {
                // ...} -> done
                if (this._accept(4 /* CurlyClose */)) {
                    parent.appendChild(placeholder);
                    return true;
                }
                if (this._parse(placeholder)) {
                    continue;
                }
                // fallback
                parent.appendChild(new Text('${' + index + ':'));
                placeholder.children.forEach(parent.appendChild, parent);
                return true;
            }
        }
        else if (placeholder.index > 0 && this._accept(7 /* Pipe */)) {
            // ${1|one,two,three|}
            var choice = new Choice();
            while (true) {
                if (this._parseChoiceElement(choice)) {
                    if (this._accept(2 /* Comma */)) {
                        // opt, -> more
                        continue;
                    }
                    if (this._accept(7 /* Pipe */)) {
                        placeholder.appendChild(choice);
                        if (this._accept(4 /* CurlyClose */)) {
                            // ..|} -> done
                            parent.appendChild(placeholder);
                            return true;
                        }
                    }
                }
                this._backTo(token);
                return false;
            }
        }
        else if (this._accept(6 /* Forwardslash */)) {
            // ${1/<regex>/<format>/<options>}
            if (this._parseTransform(placeholder)) {
                parent.appendChild(placeholder);
                return true;
            }
            this._backTo(token);
            return false;
        }
        else if (this._accept(4 /* CurlyClose */)) {
            // ${1}
            parent.appendChild(placeholder);
            return true;
        }
        else {
            // ${1 <- missing curly or colon
            return this._backTo(token);
        }
    };
    SnippetParser.prototype._parseChoiceElement = function (parent) {
        var token = this._token;
        var values = [];
        while (true) {
            if (this._token.type === 2 /* Comma */ || this._token.type === 7 /* Pipe */) {
                break;
            }
            var value = void 0;
            if (value = this._accept(5 /* Backslash */, true)) {
                // \, \|, or \\
                value = this._accept(2 /* Comma */, true)
                    || this._accept(7 /* Pipe */, true)
                    || this._accept(5 /* Backslash */, true)
                    || value;
            }
            else {
                value = this._accept(undefined, true);
            }
            if (!value) {
                // EOF
                this._backTo(token);
                return false;
            }
            values.push(value);
        }
        if (values.length === 0) {
            this._backTo(token);
            return false;
        }
        parent.appendChild(new Text(values.join('')));
        return true;
    };
    // ${foo:<children>}, ${foo} -> variable
    SnippetParser.prototype._parseComplexVariable = function (parent) {
        var name;
        var token = this._token;
        var match = this._accept(0 /* Dollar */)
            && this._accept(3 /* CurlyOpen */)
            && (name = this._accept(9 /* VariableName */, true));
        if (!match) {
            return this._backTo(token);
        }
        var variable = new Variable(name);
        if (this._accept(1 /* Colon */)) {
            // ${foo:<children>}
            while (true) {
                // ...} -> done
                if (this._accept(4 /* CurlyClose */)) {
                    parent.appendChild(variable);
                    return true;
                }
                if (this._parse(variable)) {
                    continue;
                }
                // fallback
                parent.appendChild(new Text('${' + name + ':'));
                variable.children.forEach(parent.appendChild, parent);
                return true;
            }
        }
        else if (this._accept(6 /* Forwardslash */)) {
            // ${foo/<regex>/<format>/<options>}
            if (this._parseTransform(variable)) {
                parent.appendChild(variable);
                return true;
            }
            this._backTo(token);
            return false;
        }
        else if (this._accept(4 /* CurlyClose */)) {
            // ${foo}
            parent.appendChild(variable);
            return true;
        }
        else {
            // ${foo <- missing curly or colon
            return this._backTo(token);
        }
    };
    SnippetParser.prototype._parseTransform = function (parent) {
        // ...<regex>/<format>/<options>}
        var transform = new Transform();
        var regexValue = '';
        var regexOptions = '';
        // (1) /regex
        while (true) {
            if (this._accept(6 /* Forwardslash */)) {
                break;
            }
            var escaped = void 0;
            if (escaped = this._accept(5 /* Backslash */, true)) {
                escaped = this._accept(6 /* Forwardslash */, true) || escaped;
                regexValue += escaped;
                continue;
            }
            if (this._token.type !== 14 /* EOF */) {
                regexValue += this._accept(undefined, true);
                continue;
            }
            return false;
        }
        // (2) /format
        while (true) {
            if (this._accept(6 /* Forwardslash */)) {
                break;
            }
            var escaped = void 0;
            if (escaped = this._accept(5 /* Backslash */, true)) {
                escaped = this._accept(6 /* Forwardslash */, true) || escaped;
                transform.appendChild(new Text(escaped));
                continue;
            }
            if (this._parseFormatString(transform) || this._parseAnything(transform)) {
                continue;
            }
            return false;
        }
        // (3) /option
        while (true) {
            if (this._accept(4 /* CurlyClose */)) {
                break;
            }
            if (this._token.type !== 14 /* EOF */) {
                regexOptions += this._accept(undefined, true);
                continue;
            }
            return false;
        }
        try {
            transform.regexp = new RegExp(regexValue, regexOptions);
        }
        catch (e) {
            // invalid regexp
            return false;
        }
        parent.transform = transform;
        return true;
    };
    SnippetParser.prototype._parseFormatString = function (parent) {
        var token = this._token;
        if (!this._accept(0 /* Dollar */)) {
            return false;
        }
        var complex = false;
        if (this._accept(3 /* CurlyOpen */)) {
            complex = true;
        }
        var index = this._accept(8 /* Int */, true);
        if (!index) {
            this._backTo(token);
            return false;
        }
        else if (!complex) {
            // $1
            parent.appendChild(new FormatString(Number(index)));
            return true;
        }
        else if (this._accept(4 /* CurlyClose */)) {
            // ${1}
            parent.appendChild(new FormatString(Number(index)));
            return true;
        }
        else if (!this._accept(1 /* Colon */)) {
            this._backTo(token);
            return false;
        }
        if (this._accept(6 /* Forwardslash */)) {
            // ${1:/upcase}
            var shorthand = this._accept(9 /* VariableName */, true);
            if (!shorthand || !this._accept(4 /* CurlyClose */)) {
                this._backTo(token);
                return false;
            }
            else {
                parent.appendChild(new FormatString(Number(index), shorthand));
                return true;
            }
        }
        else if (this._accept(11 /* Plus */)) {
            // ${1:+<if>}
            var ifValue = this._until(4 /* CurlyClose */);
            if (ifValue) {
                parent.appendChild(new FormatString(Number(index), undefined, ifValue, undefined));
                return true;
            }
        }
        else if (this._accept(12 /* Dash */)) {
            // ${2:-<else>}
            var elseValue = this._until(4 /* CurlyClose */);
            if (elseValue) {
                parent.appendChild(new FormatString(Number(index), undefined, undefined, elseValue));
                return true;
            }
        }
        else if (this._accept(13 /* QuestionMark */)) {
            // ${2:?<if>:<else>}
            var ifValue = this._until(1 /* Colon */);
            if (ifValue) {
                var elseValue = this._until(4 /* CurlyClose */);
                if (elseValue) {
                    parent.appendChild(new FormatString(Number(index), undefined, ifValue, elseValue));
                    return true;
                }
            }
        }
        else {
            // ${1:<else>}
            var elseValue = this._until(4 /* CurlyClose */);
            if (elseValue) {
                parent.appendChild(new FormatString(Number(index), undefined, undefined, elseValue));
                return true;
            }
        }
        this._backTo(token);
        return false;
    };
    SnippetParser.prototype._parseAnything = function (marker) {
        if (this._token.type !== 14 /* EOF */) {
            marker.appendChild(new Text(this._scanner.tokenText(this._token)));
            this._accept(undefined);
            return true;
        }
        return false;
    };
    return SnippetParser;
}());
export { SnippetParser };
