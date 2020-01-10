import { Badge } from './Badge';
import { PaginatedSandboxes } from './PaginatedSandboxes';
import { Selection } from './Selection';
import { SmallSandbox } from './SmallSandbox';

export type User = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  twitter: string | null;
  showcasedSandboxShortid: string | null;
  sandboxCount: number;
  givenLikeCount: number;
  receivedLikeCount: number;
  currentModuleShortid: string;
  viewCount: number;
  forkedCount: number;
  sandboxes: PaginatedSandboxes;
  likedSandboxes: PaginatedSandboxes;
  badges: Badge[];
  topSandboxes: SmallSandbox[];
  subscriptionSince: string;
  selection: Selection | null;
};
