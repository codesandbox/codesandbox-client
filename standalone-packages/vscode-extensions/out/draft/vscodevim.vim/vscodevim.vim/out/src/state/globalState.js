"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jumpTracker_1 = require("../jumps/jumpTracker");
const searchState_1 = require("./searchState");
const historyFile_1 = require("../util/historyFile");
const position_1 = require("../common/motion/position");
const mode_1 = require("../mode/mode");
/**
 * State which stores global state (across editors)
 */
class GlobalState {
    /**
     * Getters and setters for changing global state
     */
    get searchStatePrevious() {
        return GlobalState._searchStatePrevious;
    }
    set searchStatePrevious(states) {
        GlobalState._searchStatePrevious = GlobalState._searchStatePrevious.concat(states);
    }
    loadSearchHistory() {
        if (GlobalState._searchHistory === undefined) {
            GlobalState._searchHistory = new historyFile_1.SearchHistory();
            GlobalState._searchHistory
                .get()
                .forEach(val => this.searchStatePrevious.push(new searchState_1.SearchState(searchState_1.SearchDirection.Forward, new position_1.Position(0, 0), val, undefined, mode_1.ModeName.Normal)));
        }
    }
    addNewSearchHistoryItem(searchString) {
        if (GlobalState._searchHistory !== undefined) {
            GlobalState._searchHistory.add(searchString);
        }
    }
    get previousFullAction() {
        return GlobalState._previousFullAction;
    }
    set previousFullAction(state) {
        GlobalState._previousFullAction = state;
    }
    get substituteState() {
        return GlobalState._substituteState;
    }
    set substituteState(state) {
        GlobalState._substituteState = state;
    }
    get searchState() {
        return GlobalState._searchState;
    }
    set searchState(state) {
        GlobalState._searchState = state;
    }
    get searchStateIndex() {
        return GlobalState._searchStateIndex;
    }
    set searchStateIndex(state) {
        GlobalState._searchStateIndex = state;
    }
    get hl() {
        return GlobalState._hl;
    }
    set hl(enabled) {
        GlobalState._hl = enabled;
    }
    get jumpTracker() {
        return GlobalState._jumpTracker;
    }
}
/**
 * The keystroke sequence that made up our last complete action (that can be
 * repeated with '.').
 */
GlobalState._previousFullAction = undefined;
/**
 * Previous searches performed
 */
GlobalState._searchStatePrevious = [];
/**
 * Last substitute state for running :s by itself
 */
GlobalState._substituteState = undefined;
/**
 * Last search state for running n and N commands
 */
GlobalState._searchState = undefined;
/**
 *  Index used for navigating search history with <up> and <down> when searching
 */
GlobalState._searchStateIndex = 0;
/**
 * Used internally for nohl.
 */
GlobalState._hl = true;
/**
 * Track jumps, and traverse jump history
 */
GlobalState._jumpTracker = new jumpTracker_1.JumpTracker();
exports.GlobalState = GlobalState;

//# sourceMappingURL=globalState.js.map
