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
const path = require("path");
const logger_1 = require("../util/logger");
const configuration_1 = require("../configuration/configuration");
const util_1 = require("../util/util");
const util_2 = require("util");
const mkdirp = require('mkdirp');
class HistoryFile {
    constructor(historyFileName, historyDir) {
        this._logger = logger_1.Logger.get('HistoryFile');
        this._history = [];
        this._historyFileName = historyFileName;
        this._historyDir = historyDir ? historyDir : util_1.getExtensionDirPath();
    }
    get historyFilePath() {
        return path.join(this._historyDir, this._historyFileName);
    }
    add(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value || value.length === 0) {
                return;
            }
            // remove duplicates
            let index = this._history.indexOf(value);
            if (index !== -1) {
                this._history.splice(index, 1);
            }
            // append to the end
            this._history.push(value);
            // resize array if necessary
            if (this._history.length > configuration_1.configuration.history) {
                this._history = this._history.slice(this._history.length - configuration_1.configuration.history);
            }
            return this.save();
        });
    }
    get() {
        // resize array if necessary
        if (this._history.length > configuration_1.configuration.history) {
            this._history = this._history.slice(this._history.length - configuration_1.configuration.history);
        }
        return this._history;
    }
    clear() {
        try {
            this._history = [];
            fs.unlinkSync(this.historyFilePath);
        }
        catch (err) {
            this._logger.warn(`Unable to delete ${this.historyFilePath}. err=${err}.`);
        }
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = '';
            try {
                data = yield util_2.promisify(fs.readFile)(this.historyFilePath, 'utf-8');
            }
            catch (err) {
                if (err.code === 'ENOENT') {
                    this._logger.debug(`History does not exist. path=${this._historyDir}`);
                }
                else {
                    this._logger.warn(`Failed to load history. path=${this._historyDir} err=${err}.`);
                }
                return;
            }
            if (data.length === 0) {
                return;
            }
            try {
                let parsedData = JSON.parse(data);
                if (!Array.isArray(parsedData)) {
                    throw Error('Unexpected format in history file. Expected JSON.');
                }
                this._history = parsedData;
            }
            catch (e) {
                this._logger.warn(`Deleting corrupted history file. path=${this._historyDir} err=${e}.`);
                this.clear();
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // create supplied directory. if directory already exists, do nothing.
                yield util_2.promisify(mkdirp)(this._historyDir, 0o775);
                // create file
                yield util_2.promisify(fs.writeFile)(this.historyFilePath, JSON.stringify(this._history), 'utf-8');
            }
            catch (err) {
                this._logger.error(`Failed to save history. filepath=${this.historyFilePath}. err=${err}.`);
                throw err;
            }
        });
    }
}
exports.HistoryFile = HistoryFile;
class SearchHistory extends HistoryFile {
    constructor(historyFileDir) {
        super('.search_history', historyFileDir);
    }
}
exports.SearchHistory = SearchHistory;
class CommandLineHistory extends HistoryFile {
    constructor(historyFileDir) {
        super('.cmdline_history', historyFileDir);
    }
}
exports.CommandLineHistory = CommandLineHistory;

//# sourceMappingURL=historyFile.js.map
