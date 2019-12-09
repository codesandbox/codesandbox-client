"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const exec_1 = require('./exec');
function format(exec_path, ident_width, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield exec_1.default(exec_path, ['-s', ident_width.toString()], text);
        }
        catch (errors) {
            console.warn('prisma-fmt error\'d during formatting. This was likely due to a syntax error. Please see linter output.');
            return text;
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = format;
//# sourceMappingURL=format.js.map