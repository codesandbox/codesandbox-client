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
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const textEditor_1 = require("../../textEditor");
const node = require("../node");
//
//  Implements :read and :read!
//  http://vimdoc.sourceforge.net/htmldoc/insert.html#:read
//  http://vimdoc.sourceforge.net/htmldoc/insert.html#:read!
//
class ReadCommand extends node.CommandBase {
    constructor(args) {
        super();
        this.neovimCapable = true;
        this._name = 'read';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const textToInsert = yield this.getTextToInsert();
            if (textToInsert) {
                yield textEditor_1.TextEditor.insert(textToInsert);
            }
        });
    }
    getTextToInsert() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.arguments.file && this.arguments.file.length > 0) {
                return yield this.getTextToInsertFromFile();
            }
            else if (this.arguments.cmd && this.arguments.cmd.length > 0) {
                return yield this.getTextToInsertFromCmd();
            }
            else {
                throw Error('Invalid arguments');
            }
        });
    }
    getTextToInsertFromFile() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Read encoding from ++opt argument.
            return new Promise((resolve, reject) => {
                try {
                    fs_1.readFile(this.arguments.file, 'utf8', (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(data);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getTextToInsertFromCmd() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    child_process_1.exec(this.arguments.cmd, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(stdout);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
exports.ReadCommand = ReadCommand;

//# sourceMappingURL=read.js.map
