import { SmallSandbox } from './SmallSandbox';

export type Profile = {
  id: string; // User/Team ID
  avatar: string; // User/Team Avatar Image URL
  isContributor: boolean;
  isPro: boolean;
  isTeam: boolean;
  name: string;
  username: string;
  bio: string;
  sandboxCount: number; // Number of Sandboxes belonging to the User/Team
  templateCount: number; // Number of Templates belonging to the User/Team
  givenLikeCount: number; // Number of Sandboxes Liked by the User
  receivedLikeCount: number;
  associations: {
    thumbnail: string; // GitHub Profile Image URL
    url: string; // URL to user or team profile
    entityName: string; // Name of User or Team
  }[];
  socialLinks: string[]; // List of URLs
  // Featured Sandbox
  featuredSandbox?: string; // Sandbox ID
  pinnedSandboxes: SmallSandbox[]; // Possibly Paginated?
  sandboxes: SmallSandbox[]; // Paginated List
  templates: SmallSandbox[]; // Paginated List
  likes: SmallSandbox[]; // Paginated List
  insertedAt: string;
}
