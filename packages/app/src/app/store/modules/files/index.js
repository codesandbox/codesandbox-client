import { Module } from 'cerebral';
import * as sequences from './sequences';

export default Module({
  model: {},
  state: {},
  signals: {
    addedFileToSandbox: sequences.addFileToSandbox,
    gotUploadedFiles: sequences.getUploadedFiles,
    deletedUploadedFile: sequences.deleteUploadedFile,
    filesUploaded: sequences.uploadFiles,
    moduleCreated: sequences.createModule,
    moduleRenamed: sequences.renameModule,
    directoryCreated: sequences.createDirectory,
    directoryRenamed: sequences.renameDirectory,
    moduleMovedToDirectory: sequences.moveModuleToDirectory,
    directoryMovedToDirectory: sequences.moveDirectoryToDirectory,
    directoryDeleted: sequences.deleteDirectory,
    moduleDeleted: sequences.deleteModule,
    createModulesByPath: sequences.createModulesByPath,
  },
});
