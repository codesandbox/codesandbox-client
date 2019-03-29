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
const iconfigurationValidator_1 = require("./iconfigurationValidator");
const inputMethodSwitcherValidator_1 = require("./validators/inputMethodSwitcherValidator");
const neovimValidator_1 = require("./validators/neovimValidator");
const remappingValidator_1 = require("./validators/remappingValidator");
class ConfigurationValidator {
    constructor() {
        this._validators = [
            new inputMethodSwitcherValidator_1.InputMethodSwitcherConfigurationValidator(),
            new neovimValidator_1.NeovimValidator(),
            new remappingValidator_1.RemappingValidator(),
        ];
    }
    validate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = new iconfigurationValidator_1.ValidatorResults();
            for (const validator of this._validators) {
                let validatorResults = yield validator.validate(config);
                if (validatorResults.hasError) {
                    // errors found in configuration, disable feature
                    validator.disable(config);
                }
                results.concat(validatorResults);
            }
            return results;
        });
    }
}
exports.configurationValidator = new ConfigurationValidator();

//# sourceMappingURL=configurationValidator.js.map
