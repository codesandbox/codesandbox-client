"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const configuration_1 = require("../configuration/configuration");
const mode_1 = require("../mode/mode");
const actions_1 = require("./../actions/commands/actions");
const operator_1 = require("./../actions/operator");
/**
 * The RecordedState class holds the current action that the user is
 * doing. Example: Imagine that the user types:
 *
 * 5"qdw
 *
 * Then the relevent state would be
 *   * count of 5
 *   * copy into q register
 *   * delete operator
 *   * word movement
 *
 *
 * Or imagine the user types:
 *
 * vw$}}d
 *
 * Then the state would be
 *   * Visual mode action
 *   * (a list of all the motions you ran)
 *   * delete operator
 */
class RecordedState {
    constructor() {
        /**
         * The keys the user has pressed that have not caused an action to be
         * executed yet. Used for showcmd and command remapping.
         */
        this.commandList = [];
        /**
         * Keeps track of keys pressed for the next action. Comes in handy when parsing
         * multiple length movements, e.g. gg.
         */
        this.actionKeys = [];
        /**
         * Every action that has been run.
         */
        this.actionsRun = [];
        this.hasRunOperator = false;
        this.hasRunSurround = false;
        this.surroundKeys = [];
        this.surroundKeyIndexStart = 0;
        this.isInsertion = false;
        /**
         * The text transformations that we want to run. They will all be run after the action has been processed.
         *
         * Running an individual action will generally queue up to one of these, but if you're in
         * multi-cursor mode, you'll queue one per cursor, or more.
         *
         * Note that the text transformations are run in parallel. This is useful in most cases,
         * but will get you in trouble in others.
         */
        this.transformations = [];
        /**
         * The number of times the user wants to repeat this action.
         */
        this.count = 0;
        this.registerName = configuration_1.configuration.useSystemClipboard ? '*' : '"';
    }
    /**
     * String representation of the exact keys that the user entered. Used for
     * showcmd.
     */
    get commandString() {
        let result = '';
        for (const key of this.commandList) {
            if (key === configuration_1.configuration.leader) {
                result += '<leader>';
            }
            else {
                result += key;
            }
        }
        return result;
    }
    /**
     * Determines if the current command list is prefixed with a count
     */
    get commandWithoutCountPrefix() {
        return this.commandList.join('').replace(/^[0-9]+/g, '');
    }
    /**
     * Reset the command list.
     */
    resetCommandList() {
        this.commandList = [];
    }
    /**
     * The operator (e.g. d, y, >) the user wants to run, if there is one.
     */
    get operator() {
        let list = _.filter(this.actionsRun, a => a instanceof operator_1.BaseOperator).reverse();
        return list[0];
    }
    get operators() {
        return _.filter(this.actionsRun, a => a instanceof operator_1.BaseOperator).reverse();
    }
    /**
     * The command (e.g. i, ., R, /) the user wants to run, if there is one.
     */
    get command() {
        const list = _.filter(this.actionsRun, a => a instanceof actions_1.BaseCommand).reverse();
        // TODO - disregard <Esc>, then assert this is of length 1.
        return list[0];
    }
    get hasRunAMovement() {
        return _.filter(this.actionsRun, a => a.isMotion).length > 0;
    }
    clone() {
        const res = new RecordedState();
        // TODO: Actual clone.
        res.actionKeys = this.actionKeys.slice(0);
        res.actionsRun = this.actionsRun.slice(0);
        res.hasRunOperator = this.hasRunOperator;
        res.hasRunSurround = this.hasRunSurround;
        res.surroundKeys = this.surroundKeys;
        return res;
    }
    operatorReadyToExecute(mode) {
        // Visual modes do not require a motion -- they ARE the motion.
        return (this.operator &&
            !this.hasRunOperator &&
            mode !== mode_1.ModeName.SearchInProgressMode &&
            mode !== mode_1.ModeName.CommandlineInProgress &&
            (this.hasRunAMovement ||
                (mode === mode_1.ModeName.Visual || mode === mode_1.ModeName.VisualLine) ||
                (this.operators.length > 1 &&
                    this.operators.reverse()[0].constructor === this.operators.reverse()[1].constructor)));
    }
}
exports.RecordedState = RecordedState;

//# sourceMappingURL=recordedState.js.map
