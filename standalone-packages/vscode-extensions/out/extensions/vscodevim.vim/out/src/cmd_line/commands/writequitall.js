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
const wall = require("../commands/wall");
const node = require("../node");
const quit = require("./quit");
class WriteQuitAllCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'writequitall';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    // Writing command. Taken as a basis from the "write.ts" file.
    execute(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            let writeArgs = {
                bang: this.arguments.bang,
            };
            let quitArgs = {
                // wq! fails when no file name is provided
                bang: false,
            };
            const wallCmd = new wall.WallCommand(writeArgs);
            yield wallCmd.execute();
            quitArgs.quitAll = true;
            const quitCmd = new quit.QuitCommand(quitArgs);
            yield quitCmd.execute();
        });
    }
}
exports.WriteQuitAllCommand = WriteQuitAllCommand;

//# sourceMappingURL=writequitall.js.map
