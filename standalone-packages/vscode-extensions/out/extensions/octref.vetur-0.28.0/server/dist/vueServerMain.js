"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vls_1 = require("./services/vls");
const connection = process.argv.length <= 2 ? node_1.createConnection(process.stdin, process.stdout) : node_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
const vls = new vls_1.VLS(connection);
connection.onInitialize((params) => __awaiter(void 0, void 0, void 0, function* () {
    yield vls.init(params);
    console.log('Vetur initialized');
    return {
        capabilities: vls.capabilities
    };
}));
vls.listen();
//# sourceMappingURL=vueServerMain.js.map