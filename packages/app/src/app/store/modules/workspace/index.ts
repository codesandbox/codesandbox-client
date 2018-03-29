import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import { items } from './computed';
import { State } from './types';

const state: State = {
    project: {
        title: '',
        description: ''
    },
    tags: {
        tag: '',
        tagName: ''
    },
    openedWorkspaceItem: 'files',
    items
};

const signals = {
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
    toggleCurrentWorkspaceItem: sequences.toggleCurrentWorkspaceItem
};

export default Module<State, typeof signals>({
    state,
    signals
});
