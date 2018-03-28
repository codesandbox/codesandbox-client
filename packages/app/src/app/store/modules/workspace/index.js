import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import { items } from './computed';

export default Module({
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
    items,
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
