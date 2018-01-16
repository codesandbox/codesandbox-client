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
    tags: {
      tag: '',
      tagName: '',
    },
    openedWorkspaceItem: 'files',
  },
  signals: {
    valueChanged: sequences.changeValue,
    tagChanged: sequences.updateTag,
    tagAdded: sequences.addTag,
    tagRemoved: sequences.removeTag,
    sandboxInfoUpdated: sequences.updateSandboxInfo,
    externalResourceAdded: sequences.addExternalResource,
    externalResourceRemoved: sequences.removeExternalResource,
    integrationsOpened: sequences.openIntegrations,
    sandboxDeleted: sequences.deleteSandbox,
    sandboxPrivacyChanged: sequences.changeSandboxPrivacy,
    setWorkspaceItem: sequences.setWorkspaceItem,
    toggleCurrentWorkspaceItem: sequences.toggleCurrentWorkspaceItem,
  },
});
