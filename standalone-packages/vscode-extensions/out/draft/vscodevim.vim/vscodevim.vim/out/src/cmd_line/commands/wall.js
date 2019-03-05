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
const vscode = require("vscode");
const node = require("../node");
//
//  Implements :wall (write all)
//  http://vimdoc.sourceforge.net/htmldoc/editing.html#:wall
//
class WallCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'wall';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO : overwrite readonly files when bang? == true
            yield vscode.workspace.saveAll(false);
        });
    }
}
exports.WallCommand = WallCommand;

//# sourceMappingURL=wall.js.map
