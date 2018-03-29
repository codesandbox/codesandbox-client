import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import { State } from './types';

const state: State = {};

const signals = {
    moduleCreated: sequences.createModule,
    moduleRenamed: sequences.renameModule,
    directoryCreated: sequences.createDirectory,
    directoryRenamed: sequences.renameDirectory,
    moduleMovedToDirectory: sequences.moveModuleToDirectory,
    directoryMovedToDirectory: sequences.moveDirectoryToDirectory,
    directoryDeleted: sequences.deleteDirectory,
    moduleDeleted: sequences.deleteModule
};

export default Module<State, typeof signals>({
    state,
    signals
});
