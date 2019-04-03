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
const configuration_1 = require("./../../configuration/configuration");
const digraphs_1 = require("../../actions/commands/digraphs");
const node = require("../node");
const textEditor_1 = require("../../textEditor");
class DigraphsCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'digraphs';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    makeQuickPicks(digraphs) {
        const quickPicks = new Array();
        for (let digraphKey of Object.keys(digraphs)) {
            let [charDesc, charCodes] = digraphs[digraphKey];
            quickPicks.push({
                label: digraphKey,
                description: `${charDesc} (user)`,
                charCodes,
            });
        }
        return quickPicks;
    }
    execute(vimState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.arguments.arg !== undefined && this.arguments.arg.length > 2) {
                // TODO: Register digraphs in args in state
            }
            const digraphKeyAndContent = this.makeQuickPicks(configuration_1.configuration.digraphs).concat(this.makeQuickPicks(digraphs_1.DefaultDigraphs));
            vscode.window.showQuickPick(digraphKeyAndContent).then((val) => __awaiter(this, void 0, void 0, function* () {
                if (val) {
                    const char = String.fromCharCode(...val.charCodes);
                    yield textEditor_1.TextEditor.insert(char);
                }
            }));
        });
    }
}
exports.DigraphsCommand = DigraphsCommand;

//# sourceMappingURL=digraph.js.map
