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
const configuration_1 = require("../../configuration/configuration");
const message_1 = require("../../util/message");
const node = require("../node");
var SetOptionOperator;
(function (SetOptionOperator) {
    /*
     * Set string or number option to {value}.
     * White space between {option} and '=' is allowed and will be ignored.  White space between '=' and {value} is not allowed.
     */
    SetOptionOperator[SetOptionOperator["Equal"] = 0] = "Equal";
    /*
     * Toggle option: set, switch it on.
     * Number option: show value.
     * String option: show value.
     */
    SetOptionOperator[SetOptionOperator["Set"] = 1] = "Set";
    /*
     * Toggle option: Reset, switch it off.
     */
    SetOptionOperator[SetOptionOperator["Reset"] = 2] = "Reset";
    /**
     * Toggle option: Insert value.
     */
    SetOptionOperator[SetOptionOperator["Invert"] = 3] = "Invert";
    /*
     * Add the {value} to a number option, or append the {value} to a string option.
     * When the option is a comma separated list, a comma is added, unless the value was empty.
     */
    SetOptionOperator[SetOptionOperator["Append"] = 4] = "Append";
    /*
     * Subtract the {value} from a number option, or remove the {value} from a string option, if it is there.
     */
    SetOptionOperator[SetOptionOperator["Subtract"] = 5] = "Subtract";
    /**
     * Multiply the {value} to a number option, or prepend the {value} to a string option.
     */
    SetOptionOperator[SetOptionOperator["Multiply"] = 6] = "Multiply";
    /**
     * Show value of {option}.
     */
    SetOptionOperator[SetOptionOperator["Info"] = 7] = "Info";
})(SetOptionOperator = exports.SetOptionOperator || (exports.SetOptionOperator = {}));
class SetOptionsCommand extends node.CommandBase {
    constructor(args) {
        super();
        this._name = 'setoptions';
        this._arguments = args;
    }
    get arguments() {
        return this._arguments;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._arguments.name) {
                throw new Error('Missing argument.');
            }
            if (configuration_1.configuration[this._arguments.name] == null) {
                throw new Error('Unsupported option. ' + this._arguments.name);
            }
            switch (this._arguments.operator) {
                case SetOptionOperator.Set:
                    configuration_1.configuration[this._arguments.name] = true;
                    break;
                case SetOptionOperator.Reset:
                    configuration_1.configuration[this._arguments.name] = false;
                    break;
                case SetOptionOperator.Equal:
                    configuration_1.configuration[this._arguments.name] = this._arguments.value;
                    break;
                case SetOptionOperator.Invert:
                    configuration_1.configuration[this._arguments.name] = !configuration_1.configuration[this._arguments.name];
                    break;
                case SetOptionOperator.Append:
                    configuration_1.configuration[this._arguments.name] += this._arguments.value;
                    break;
                case SetOptionOperator.Subtract:
                    if (typeof this._arguments.value === 'number') {
                        configuration_1.configuration[this._arguments.name] -= this._arguments.value;
                    }
                    else {
                        let initialValue = configuration_1.configuration[this._arguments.name];
                        configuration_1.configuration[this._arguments.name] = initialValue
                            .split(this._arguments.value)
                            .join('');
                    }
                    break;
                case SetOptionOperator.Info:
                    let value = configuration_1.configuration[this._arguments.name];
                    if (value === undefined) {
                        yield message_1.Message.ShowError(`E518 Unknown option: ${this._arguments.name}`);
                    }
                    else {
                        yield message_1.Message.ShowInfo(`${this._arguments.name}=${value}`);
                    }
                    break;
                default:
                    break;
            }
        });
    }
}
exports.SetOptionsCommand = SetOptionsCommand;

//# sourceMappingURL=setoptions.js.map
