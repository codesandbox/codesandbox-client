import { Module } from 'cerebral';
import model from './model';
import * as sequences from './sequences';
import {
  current,
  isProfileCurrentUser,
  showcasedSandbox,
  currentSandboxes,
  currentLikedSandboxes,
} from './getters';

export default Module({
  model,
  state: {
    profiles: {},
    currentProfileId: null,
    notFound: false,
    isLoadingProfile: true,
    sandboxes: {},
    likedSandboxes: {},
    currentSandboxesPage: 1,
    currentLikedSandboxesPage: 1,
    isLoadingSandboxes: false,
  },
  getters: {
    current,
    isProfileCurrentUser,
    showcasedSandbox,
    currentSandboxes,
    currentLikedSandboxes,
  },
  signals: {
    profileMounted: sequences.loadProfile,
    sandboxesPageChanged: sequences.loadSandboxes,
    likedSandboxesPageChanged: sequences.loadLikedSandboxes,
  },
});
