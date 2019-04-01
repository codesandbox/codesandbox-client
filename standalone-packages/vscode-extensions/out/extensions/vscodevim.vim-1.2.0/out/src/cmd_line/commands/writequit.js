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
const node = require("../node");
const quit = require("./quit");
const write = require("./write");
class WriteQuitCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'writequit';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    // Writing command. Taken as a basis from the "write.ts" file.
    execute(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let writeArgs = {
                opt: this.arguments.opt,
                optValue: this.arguments.optValue,
                bang: this.arguments.bang,
                file: this.arguments.file,
                range: this.arguments.range,
            };
            let writeCmd = new write.WriteCommand(writeArgs);
            yield writeCmd.execute(vimState);
            let quitArgs = {
                // wq! fails when no file name is provided
                bang: false,
                range: this.arguments.range,
            };
            let quitCmd = new quit.QuitCommand(quitArgs);
            yield quitCmd.execute();
        });
    }
}
exports.WriteQuitCommand = WriteQuitCommand;

//# sourceMappingURL=writequit.js.map
