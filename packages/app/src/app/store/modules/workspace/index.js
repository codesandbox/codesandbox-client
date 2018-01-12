import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import { addNpmDependency } from '../../sequences';

export default Module({
  model,
  state: {
    project: {
      title: '',
      description: '',
    },
    tags: {
      tag: '',
      tagName: '',
    },
    showSearchDependenciesModal: false,
    showDeleteSandboxModal: false,
    openedWorkspaceItem: 'files',
  },
  signals: {
    valueChanged: sequences.changeValue,
    tagChanged: sequences.updateTag,
    tagAdded: sequences.addTag,
    tagRemoved: sequences.removeTag,
    sandboxInfoUpdated: sequences.updateSandboxInfo,
    npmDependencyAdded: addNpmDependency,
    npmDependencyRemoved: sequences.removeNpmDependency,
    externalResourceAdded: sequences.addExternalResource,
    externalResourceRemoved: sequences.removeExternalResource,
    searchDependenciesModalClosed: sequences.closeSearchDependenciesModal,
    searchDependenciesModalOpened: sequences.openSearchDependenciesModal,
    integrationsOpened: sequences.openIntegrations,
    deleteSandboxModalOpened: sequences.openDeleteSandboxModal,
    deleteSandboxModalClosed: sequences.closeDeleteSandboxModal,
    sandboxDeleted: sequences.deleteSandbox,
    sandboxPrivacyChanged: sequences.changeSandboxPrivacy,
    setWorkspaceItem: sequences.setWorkspaceItem,
    clearCurrentWorkspaceItem: sequences.clearCurrentWorkspaceItem,
  },
});
