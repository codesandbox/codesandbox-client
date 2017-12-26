import { getParent } from 'mobx-state-tree';

export function isProfileCurrentUser() {
  return (
    getParent(this).user && getParent(this).user.id === this.currentProfileId
  );
}

export function current() {
  return this.profiles.get(this.currentProfileId);
}

export function showcasedSandbox() {
  return (
    this.current.showcasedSandboxShortid &&
    getParent(this).editor.sandboxes.get(this.current.showcasedSandboxShortid)
  );
}

export function currentLikedSandboxes() {
  return this.likedSandboxes.get(this.current.username);
}

export function currentSandboxes() {
  return this.sandboxes.get(this.current.username);
}
