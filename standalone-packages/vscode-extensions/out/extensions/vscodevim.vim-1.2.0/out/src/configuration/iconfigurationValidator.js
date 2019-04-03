"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidatorResults {
    constructor() {
        this.errors = new Array();
    }
    append(validationResult) {
        this.errors.push(validationResult);
    }
    concat(validationResults) {
        this.errors = this.errors.concat(validationResults.get());
    }
    get() {
        return this.errors;
    }
    get numErrors() {
        return this.errors.filter(e => e.level === 'error').length;
    }
    get hasError() {
        return this.numErrors > 0;
    }
    get numWarnings() {
        return this.errors.filter(e => e.level === 'warning').length;
    }
    get hasWarning() {
        return this.numWarnings > 0;
    }
}
exports.ValidatorResults = ValidatorResults;

//# sourceMappingURL=iconfigurationValidator.js.map
