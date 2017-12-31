import { Module } from 'cerebral';
import * as sequences from './sequences';

export default Module({
  model: {},
  state: {},
  signals: {
    moduleCreated: sequences.createModule,
    moduleRenamed: sequences.renameModule,
    directoryCreated: sequences.createDirectory,
    directoryRenamed: sequences.renameDirectory,
    moduleMovedToDirectory: sequences.moveModuleToDirectory,
    directoryMovedToDirectory: sequences.moveDirectoryToDirectory,
    directoryDeleted: sequences.deleteDirectory,
    moduleDeleted: sequences.deleteModule,
  },
});
