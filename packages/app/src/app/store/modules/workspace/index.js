import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';

export default Module({
  model,
  state: {
    project: {
      title: '',
      description: '',
      alias: '',
    },
    tags: {
      tag: '',
      tagName: '',
    },
    openedWorkspaceItem: null,
    workspaceHidden: false,
  },
  signals: {
    valueChanged: sequences.changeValue,
    tagChanged: sequences.updateTag,
    tagAdded: sequences.addTag,
    tagRemoved: sequences.removeTag,
    addedTemplate: sequences.addTemplate,
    sandboxInfoUpdated: sequences.updateSandboxInfo,
    externalResourceAdded: sequences.addExternalResource,
    externalResourceRemoved: sequences.removeExternalResource,
    integrationsOpened: sequences.openIntegrations,
    sandboxDeleted: sequences.deleteSandbox,
    sandboxPrivacyChanged: sequences.changeSandboxPrivacy,
    setWorkspaceItem: sequences.setWorkspaceItem,
    toggleCurrentWorkspaceItem: sequences.toggleCurrentWorkspaceItem,
    setWorkspaceHidden: sequences.setWorkspaceHidden,
  },
});
