"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const position_1 = require("./../../../common/motion/position");
const configuration_1 = require("./../../../configuration/configuration");
const textEditor_1 = require("./../../../textEditor");
const markerGenerator_1 = require("./markerGenerator");
class EasyMotion {
    constructor() {
        /**
         * Refers to the accumulated keys for depth navigation
         */
        this.accumulation = '';
        this._markers = [];
        this.visibleMarkers = [];
        this.decorations = [];
    }
    get markers() {
        return this._markers;
    }
    static createMarkerGenerator(matchesCount) {
        return new markerGenerator_1.MarkerGenerator(matchesCount);
    }
    /**
     * Create and cache decoration types for different marker lengths
     */
    static getDecorationType(length) {
        const cache = this.decorationTypeCache[length];
        if (cache) {
            return cache;
        }
        else {
            const width = length * 8;
            const type = vscode.window.createTextEditorDecorationType({
                after: {
                    margin: `0 0 0 -${width}px`,
                    height: `14px`,
                    // This is a tricky part. Set position and z-index property along with width
                    // to bring markers to front
                    width: `${width}px; position:absoulute; z-index:99;`,
                },
            });
            this.decorationTypeCache[length] = type;
            return type;
        }
    }
    /**
     * Clear all decorations
     */
    clearDecorations() {
        const editor = vscode.window.activeTextEditor;
        for (let i = 1; i <= this.decorations.length; i++) {
            editor.setDecorations(EasyMotion.getDecorationType(i), []);
        }
    }
    /**
     * Clear all markers
     */
    clearMarkers() {
        this._markers = [];
        this.visibleMarkers = [];
    }
    addMarker(marker) {
        this._markers.push(marker);
    }
    getMarker(index) {
        return this._markers[index];
    }
    /**
     * Find markers beginning with a string
     */
    findMarkers(nail, onlyVisible) {
        const markers = onlyVisible ? this.visibleMarkers : this._markers;
        return markers.filter(marker => marker.name.startsWith(nail));
    }
    /**
     * Search and sort using the index of a match compared to the index of position (usually the cursor)
     */
    sortedSearch(position, search = '', options = {}) {
        const regex = typeof search === 'string'
            ? new RegExp(search.replace(EasyMotion.specialCharactersRegex, '\\$&'), 'g')
            : search;
        const matches = [];
        // Cursor index refers to the index of the marker that is on or to the right of the cursor
        let cursorIndex = position.character;
        let prevMatch;
        // Calculate the min/max bounds for the search
        const lineCount = textEditor_1.TextEditor.getLineCount();
        const lineMin = options.min ? Math.max(options.min.line, 0) : 0;
        const lineMax = options.max ? Math.min(options.max.line + 1, lineCount) : lineCount;
        outer: for (let lineIdx = lineMin; lineIdx < lineMax; lineIdx++) {
            const line = textEditor_1.TextEditor.getLineAt(new position_1.Position(lineIdx, 0)).text;
            let result = regex.exec(line);
            while (result) {
                if (matches.length >= 1000) {
                    break outer;
                }
                else {
                    const pos = new position_1.Position(lineIdx, result.index);
                    // Check if match is within bounds
                    if ((options.min && pos.isBefore(options.min)) ||
                        (options.max && pos.isAfter(options.max)) ||
                        Math.abs(pos.line - position.line) > 100) {
                        // Stop searching after 100 lines in both directions
                        result = regex.exec(line);
                    }
                    else {
                        // Update cursor index to the marker on the right side of the cursor
                        if (!prevMatch || prevMatch.position.isBefore(position)) {
                            cursorIndex = matches.length;
                        }
                        // Matches on the cursor position should be ignored
                        if (pos.isEqual(position)) {
                            result = regex.exec(line);
                        }
                        else {
                            prevMatch = new EasyMotion.Match(pos, result[0], matches.length);
                            matches.push(prevMatch);
                            result = regex.exec(line);
                        }
                    }
                }
            }
        }
        // Sort by the index distance from the cursor index
        matches.sort((a, b) => {
            const absDiffA = computeAboluteDiff(a.index);
            const absDiffB = computeAboluteDiff(b.index);
            return absDiffA - absDiffB;
            function computeAboluteDiff(matchIndex) {
                const absDiff = Math.abs(cursorIndex - matchIndex);
                // Prioritize the matches on the right side of the cursor index
                return matchIndex < cursorIndex ? absDiff - 0.5 : absDiff;
            }
        });
        return matches;
    }
    themeColorApiSupported() {
        // Theme color is available from version 1.12.
        const vscodeVersionAsNumber = parseInt(vscode.version.replace(/\./g, ''), 10);
        return vscodeVersionAsNumber >= 1120;
    }
    getMarkerColor(customizedValue, defaultValue, themeColorId) {
        if (!this.themeColorApiSupported()) {
            return customizedValue || defaultValue;
        }
        else {
            if (customizedValue) {
                return customizedValue;
            }
            else {
                return new vscode.ThemeColor(themeColorId);
            }
        }
    }
    getEasymotionMarkerBackgroundColor() {
        return this.getMarkerColor(configuration_1.configuration.easymotionMarkerBackgroundColor, '#000', 'activityBarBadge.background');
    }
    getEasymotionMarkerForegroundColorOneChar() {
        return this.getMarkerColor(configuration_1.configuration.easymotionMarkerForegroundColorOneChar, '#f00', 'activityBarBadge.foreground');
    }
    getEasymotionMarkerForegroundColorTwoChar() {
        return this.getMarkerColor(configuration_1.configuration.easymotionMarkerForegroundColorTwoChar, '#ffa500', 'activityBarBadge.foreground');
    }
    updateDecorations() {
        this.clearDecorations();
        this.visibleMarkers = [];
        this.decorations = [];
        // Ignore markers that do not start with the accumulated depth level
        for (const marker of this._markers.filter(m => m.name.startsWith(this.accumulation))) {
            const pos = marker.position;
            // Get keys after the depth we're at
            const keystroke = marker.name.substr(this.accumulation.length);
            if (!this.decorations[keystroke.length]) {
                this.decorations[keystroke.length] = [];
            }
            const fontColor = keystroke.length > 1
                ? this.getEasymotionMarkerForegroundColorTwoChar()
                : this.getEasymotionMarkerForegroundColorOneChar();
            const renderOptions = {
                after: {
                    contentText: keystroke,
                    backgroundColor: this.getEasymotionMarkerBackgroundColor(),
                    height: `${configuration_1.configuration.easymotionMarkerHeight}px`,
                    width: `${keystroke.length * configuration_1.configuration.easymotionMarkerWidthPerChar}px`,
                    color: fontColor,
                    textDecoration: `none;
          font-family: ${configuration_1.configuration.easymotionMarkerFontFamily};
          font-size: ${configuration_1.configuration.easymotionMarkerFontSize}px;
          font-weight: ${configuration_1.configuration.easymotionMarkerFontWeight};
          position: absolute;
          z-index: 99;
          bottom: ${configuration_1.configuration.easymotionMarkerYOffset}px`,
                },
            };
            // Position should be offsetted by the length of the keystroke to prevent hiding behind the gutter
            const charPos = pos.character + 1 + (keystroke.length - 1);
            this.decorations[keystroke.length].push({
                range: new vscode.Range(pos.line, charPos, pos.line, charPos),
                renderOptions: {
                    dark: renderOptions,
                    light: renderOptions,
                },
            });
            this.visibleMarkers.push(marker);
        }
        // Set the decorations for all the different marker lengths
        const editor = vscode.window.activeTextEditor;
        for (let j = 1; j < this.decorations.length; j++) {
            if (this.decorations[j]) {
                editor.setDecorations(EasyMotion.getDecorationType(j), this.decorations[j]);
            }
        }
    }
}
/**
 * TODO: For future motions
 */
EasyMotion.specialCharactersRegex = /[\-\[\]{}()*+?.,\\\^$|#\s]/g;
/**
 * Caches for decorations
 */
EasyMotion.decorationTypeCache = [];
exports.EasyMotion = EasyMotion;
(function (EasyMotion) {
    class Marker {
        constructor(name, position) {
            this._name = name;
            this._position = position;
        }
        get name() {
            return this._name;
        }
        get position() {
            return this._position;
        }
    }
    EasyMotion.Marker = Marker;
    class Match {
        constructor(position, text, index) {
            this._position = position;
            this._text = text;
            this._index = index;
        }
        get position() {
            return this._position;
        }
        get text() {
            return this._text;
        }
        get index() {
            return this._index;
        }
        set position(position) {
            this._position = position;
        }
        toRange() {
            return new vscode.Range(this.position, this.position.translate(0, this.text.length));
        }
    }
    EasyMotion.Match = Match;
})(EasyMotion = exports.EasyMotion || (exports.EasyMotion = {}));

//# sourceMappingURL=easymotion.js.map
