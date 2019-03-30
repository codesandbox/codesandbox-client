"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jumpTracker_1 = require("../jumps/jumpTracker");
const mode_1 = require("../mode/mode");
const position_1 = require("../common/motion/position");
const historyFile_1 = require("../history/historyFile");
const searchState_1 = require("./searchState");
/**
 * State which stores global state (across editors)
 */
class GlobalState {
    constructor() {
        /**
         * Previous searches performed
         */
        this._searchStatePrevious = [];
        /**
         * Track jumps, and traverse jump history
         */
        this._jumpTracker = new jumpTracker_1.JumpTracker();
        /**
         * Tracks search history
         */
        this._searchHistory = new historyFile_1.SearchHistory();
        /**
         * The keystroke sequence that made up our last complete action (that can be
         * repeated with '.').
         */
        this.previousFullAction = undefined;
        /**
         * Last substitute state for running :s by itself
         */
        this.substituteState = undefined;
        /**
         * Last search state for running n and N commands
         */
        this.searchState = undefined;
        /**
         *  Index used for navigating search history with <up> and <down> when searching
         */
        this.searchStateIndex = 0;
        /**
         * Used internally for nohl.
         */
        this.hl = true;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._searchHistory.load();
            this._searchHistory
                .get()
                .forEach(val => this.searchStatePrevious.push(new searchState_1.SearchState(searchState_1.SearchDirection.Forward, new position_1.Position(0, 0), val, undefined, mode_1.ModeName.Normal)));
        });
    }
    /**
     * Getters and setters for changing global state
     */
    get searchStatePrevious() {
        return this._searchStatePrevious;
    }
    set searchStatePrevious(states) {
        this._searchStatePrevious = this._searchStatePrevious.concat(states);
    }
    addNewSearchHistoryItem(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._searchHistory !== undefined) {
                yield this._searchHistory.add(searchString);
            }
        });
    }
    get jumpTracker() {
        return this._jumpTracker;
    }
}
exports.globalState = new GlobalState();

//# sourceMappingURL=globalState.js.map
