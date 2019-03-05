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
const configuration_1 = require("../configuration/configuration");
const logger_1 = require("./logger");
const util_1 = require("../util/util");
const mkdirp = require('mkdirp');
class HistoryFile {
    constructor(historyDir, historyFileName) {
        this._history = [];
        this._historyDir = historyDir;
        this._historyFileName = historyFileName;
        this._loadFromFile();
    }
    get _historyFilePath() {
        return path.join(this._historyDir, this._historyFileName);
    }
    add(value) {
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
        this.save();
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
            fs.unlinkSync(this._historyFilePath);
        }
        catch (err) {
            logger_1.logger.warn(`Unable to delete ${this._historyFilePath}. err=${err}.`);
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    if (!fs.existsSync(this._historyDir)) {
                        mkdirp.sync(this._historyDir, 0o775);
                    }
                }
                catch (err) {
                    logger_1.logger.error(`Failed to create directory. path=${this._historyDir}. err=${err}.`);
                    reject(err);
                }
                try {
                    fs.writeFileSync(this._historyFilePath, JSON.stringify(this._history), 'utf-8');
                }
                catch (err) {
                    logger_1.logger.error(`Failed to save history. path=${this._historyDir}. err=${err}.`);
                    reject(err);
                }
                resolve();
            });
        });
    }
    _loadFromFile() {
        let data = '';
        try {
            data = fs.readFileSync(this._historyFilePath, 'utf-8');
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                logger_1.logger.debug(`History does not exist. path=${this._historyDir}`);
            }
            else {
                logger_1.logger.error(`Failed to load history. path=${this._historyDir} err=${err}.`);
                return;
            }
        }
        if (data.length === 0) {
            return;
        }
        try {
            let parsedData = JSON.parse(data);
            if (!Array.isArray(parsedData)) {
                throw Error('Expected JSON');
            }
            this._history = parsedData;
        }
        catch (e) {
            logger_1.logger.error(`Deleting corrupted history file. path=${this._historyDir} err=${e}.`);
            this.clear();
        }
    }
}
exports.HistoryFile = HistoryFile;
class SearchHistory extends HistoryFile {
    constructor() {
        super(util_1.getExtensionDirPath(), '.search_history');
    }
}
exports.SearchHistory = SearchHistory;
class CommandLineHistory extends HistoryFile {
    constructor() {
        super(util_1.getExtensionDirPath(), '.cmdline_history');
    }
}
exports.CommandLineHistory = CommandLineHistory;

//# sourceMappingURL=historyFile.js.map
