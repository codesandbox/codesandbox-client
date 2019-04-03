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
const fs = require("fs");
const iconfigurationValidator_1 = require("../iconfigurationValidator");
const util_1 = require("util");
class NeovimValidator {
    validate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new iconfigurationValidator_1.ValidatorResults();
            if (config.enableNeovim) {
                try {
                    const stat = yield util_1.promisify(fs.stat)(config.neovimPath);
                    if (!stat.isFile()) {
                        result.append({
                            level: 'error',
                            message: `Invalid neovimPath. Please configure full path to nvim binary.`,
                        });
                    }
                }
                catch (e) {
                    result.append({
                        level: 'error',
                        message: `Invalid neovimPath. ${e.message}.`,
                    });
                }
            }
            return Promise.resolve(result);
        });
    }
    disable(config) {
        config.enableNeovim = false;
    }
}
exports.NeovimValidator = NeovimValidator;

//# sourceMappingURL=neovimValidator.js.map
