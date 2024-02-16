export type CommentData = {
  userId: string;
  sandboxId: string;
  commenterUsername: string;
  commenterAvatarUrl: string;
  sandboxName: string;
};

export type MentionData = {
  userId: string;
  sandboxId: string;
  mentionerUsername: string;
  mentionerAvatarUrl: string;
  commentPreview: string;
  commentId: string;
};

export type PullRequestReviewReceivedData = {
  branch: string;
  owner: string;
  pullRequestNumber: number;
  repo: string;
  reviewerAvatar: string;
  reviewerName: string;
  reviewState: string;
  reviewId: number;
  teamId: string;
};

export type PullRequestReviewRequestData = {
  branch: string;
  owner: string;
  pullRequestNumber: number;
  repo: string;
  requesterAvatar: string;
  requesterName: string;
  teamId: string;
};

export type TeamInviteData = {
  teamId: string;
  teamName: string;
  inviterName: string;
  inviterAvatar: string;
};

export type TeamInviteRequestData = {
  teamId: string;
  teamName: string;
  requesterEmail: string;
  requesterName: string;
  requesterAvatar: string | null;
};

export type TeamAcceptedData = {
  teamName: string;
  teamId: string;
  userName: string;
  userAvatar: string;
};

export type SandboxInvitationData = {
  inviterAvatar: string;
  inviterName: string;
  sandboxId: string;
  sandboxAlias: string | null;
  sandboxTitle: string | null;
};
