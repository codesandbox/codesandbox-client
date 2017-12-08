import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    project: {
      title: '',
      description: '',
    },
    isWorkspaceHidden: false,
    isProcessingDependencies: false,
  },
  signals: {
    valueChanged: sequences.changeValue,
    updateSandboxInfo: sequences.updateSandboxInfo,
    workspaceToggled: sequences.toggleWorkspace,
    npmDependencyAdded: sequences.addNpmDependency,
    npmDependencyRemoved: sequences.removeNpmDependency,
    externalResourceAdded: sequences.addExternalResource,
    externalResourceRemoved: sequences.removeExternalResource,
  },
});
