"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const position_1 = require("./position");
class Range {
    get start() {
        return this._start;
    }
    get stop() {
        return this._stop;
    }
    constructor(start, stop) {
        this._start = start;
        this._stop = stop;
    }
    /**
     * Create a range from a VSCode selection.
     */
    static FromVSCodeSelection(e) {
        return new Range(position_1.Position.FromVSCodePosition(e.start), position_1.Position.FromVSCodePosition(e.end));
    }
    static *IterateRanges(list) {
        for (let i = 0; i < list.length; i++) {
            yield {
                i,
                range: list[i],
                start: list[i]._start,
                stop: list[i]._stop,
            };
        }
    }
    /**
     * Create a range from an IMovement.
     */
    static FromIMovement(i) {
        // TODO: This shows a very clear need for refactoring after multi-cursor is merged!
        return new Range(i.start, i.stop);
    }
    getRight(count = 1) {
        return new Range(this._start.getRight(count), this._stop.getRight(count));
    }
    getDown(count = 1) {
        return new Range(this._start.getDownByCount(count), this._stop.getDownByCount(count));
    }
    equals(other) {
        return this._start.isEqual(other._start) && this._stop.isEqual(other._stop);
    }
    /**
     * Returns a new Range which is the same as this Range, but with the provided
     * stop value.
     */
    withNewStop(stop) {
        return new Range(this._start, stop);
    }
    /**
     * Returns a new Range which is the same as this Range, but with the provided
     * start value.
     */
    withNewStart(start) {
        return new Range(start, this._stop);
    }
    toString() {
        return `[ ${this.start.toString()} | ${this.stop.toString()}]`;
    }
    overlaps(other) {
        return this.start.isBefore(other.stop) && other.start.isBefore(this.stop);
    }
    add(diff) {
        return new Range(this.start.add(diff), this.stop.add(diff));
    }
}
exports.Range = Range;

//# sourceMappingURL=range.js.map
