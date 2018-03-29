import { Module, Computed, Dictionary } from '@cerebral/fluent';
import * as sequences from './sequences';
import * as computed from './computed';
import * as getters from './getters';
import { State } from './types';

const state: State = {
    profiles: Dictionary({}),
    currentProfileId: null,
    notFound: false,
    isLoadingProfile: true,
    sandboxes: Dictionary({}),
    likedSandboxes: Dictionary({}),
    userSandboxes: [],
    currentSandboxesPage: 1,
    currentLikedSandboxesPage: 1,
    isLoadingSandboxes: false,
    sandboxToDeleteIndex: null,
    isProfileCurrentUser: Computed(computed.isProfileCurrentUser),
    showcasedSandbox: Computed(computed.showcasedSandbox),
    get current() {
        return getters.current(this);
    },
    get currentSandboxes() {
        return getters.currentSandboxes(this);
    },
    get currentLikedSandboxes() {
        return getters.currentLikedSandboxes(this);
    }
};

const signals = {
    profileMounted: sequences.loadProfile,
    sandboxesPageChanged: sequences.loadSandboxes,
    likedSandboxesPageChanged: sequences.loadLikedSandboxes,
    selectSandboxClicked: sequences.openSelectSandboxModal,
    newSandboxShowcaseSelected: sequences.setNewSandboxShowcase,
    deleteSandboxClicked: sequences.showDeleteSandboxModal,
    sandboxDeleted: sequences.deleteSandbox
};

export default Module<State, typeof signals>({
    state,
    signals
});
