"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const close_1 = require("./subparsers/close");
const deleteRange_1 = require("./subparsers/deleteRange");
const fileCmd = require("./subparsers/file");
const nohl_1 = require("./subparsers/nohl");
const only_1 = require("./subparsers/only");
const quit_1 = require("./subparsers/quit");
const read_1 = require("./subparsers/read");
const register_1 = require("./subparsers/register");
const setoptions_1 = require("./subparsers/setoptions");
const sort_1 = require("./subparsers/sort");
const substitute_1 = require("./subparsers/substitute");
const tabCmd = require("./subparsers/tab");
const wall_1 = require("./subparsers/wall");
const write_1 = require("./subparsers/write");
const writequit_1 = require("./subparsers/writequit");
const writequitall_1 = require("./subparsers/writequitall");
// maps command names to parsers for said commands.
exports.commandParsers = {
    w: write_1.parseWriteCommandArgs,
    write: write_1.parseWriteCommandArgs,
    wa: wall_1.parseWallCommandArgs,
    wall: wall_1.parseWallCommandArgs,
    nohlsearch: nohl_1.parseNohlCommandArgs,
    noh: nohl_1.parseNohlCommandArgs,
    nohl: nohl_1.parseNohlCommandArgs,
    close: close_1.parseCloseCommandArgs,
    clo: close_1.parseCloseCommandArgs,
    quit: quit_1.parseQuitCommandArgs,
    q: quit_1.parseQuitCommandArgs,
    qa: quit_1.parseQuitAllCommandArgs,
    qall: quit_1.parseQuitAllCommandArgs,
    wq: writequit_1.parseWriteQuitCommandArgs,
    writequit: writequit_1.parseWriteQuitCommandArgs,
    x: writequit_1.parseWriteQuitCommandArgs,
    wqa: writequitall_1.parseWriteQuitAllCommandArgs,
    wqall: writequitall_1.parseWriteQuitAllCommandArgs,
    xa: writequitall_1.parseWriteQuitAllCommandArgs,
    xall: writequitall_1.parseWriteQuitAllCommandArgs,
    tabn: tabCmd.parseTabNCommandArgs,
    tabnext: tabCmd.parseTabNCommandArgs,
    tabp: tabCmd.parseTabPCommandArgs,
    tabprevious: tabCmd.parseTabPCommandArgs,
    tabN: tabCmd.parseTabPCommandArgs,
    tabNext: tabCmd.parseTabPCommandArgs,
    tabfirst: tabCmd.parseTabFirstCommandArgs,
    tabfir: tabCmd.parseTabFirstCommandArgs,
    tablast: tabCmd.parseTabLastCommandArgs,
    tabl: tabCmd.parseTabLastCommandArgs,
    tabe: tabCmd.parseTabNewCommandArgs,
    tabedit: tabCmd.parseTabNewCommandArgs,
    tabnew: tabCmd.parseTabNewCommandArgs,
    tabclose: tabCmd.parseTabCloseCommandArgs,
    tabc: tabCmd.parseTabCloseCommandArgs,
    tabo: tabCmd.parseTabOnlyCommandArgs,
    tabonly: tabCmd.parseTabOnlyCommandArgs,
    tabm: tabCmd.parseTabMovementCommandArgs,
    s: substitute_1.parseSubstituteCommandArgs,
    e: fileCmd.parseEditFileCommandArgs,
    edit: fileCmd.parseEditFileCommandArgs,
    ene: fileCmd.parseEditNewFileCommandArgs,
    enew: fileCmd.parseEditNewFileCommandArgs,
    sp: fileCmd.parseEditFileInNewHorizontalWindowCommandArgs,
    split: fileCmd.parseEditFileInNewHorizontalWindowCommandArgs,
    vs: fileCmd.parseEditFileInNewVerticalWindowCommandArgs,
    vsp: fileCmd.parseEditFileInNewVerticalWindowCommandArgs,
    vsplit: fileCmd.parseEditFileInNewVerticalWindowCommandArgs,
    new: fileCmd.parseEditNewFileInNewHorizontalWindowCommandArgs,
    vne: fileCmd.parseEditNewFileInNewVerticalWindowCommandArgs,
    vnew: fileCmd.parseEditNewFileInNewVerticalWindowCommandArgs,
    only: only_1.parseOnlyCommandArgs,
    set: setoptions_1.parseOptionsCommandArgs,
    se: setoptions_1.parseOptionsCommandArgs,
    read: read_1.parseReadCommandArgs,
    r: read_1.parseReadCommandArgs,
    reg: register_1.parseRegisterCommandArgs,
    d: deleteRange_1.parseDeleteRangeLinesCommandArgs,
    sort: sort_1.parseSortCommandArgs,
};

//# sourceMappingURL=subparser.js.map
