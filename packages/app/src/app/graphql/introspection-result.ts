export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    BookmarkEntity: ['Team', 'User'],
    Repository: ['GitHubRepository'],
    ReferenceMetadata: [
      'CodeReferenceMetadata',
      'ImageReferenceMetadata',
      'PreviewReferenceMetadata',
      'UserReferenceMetadata',
    ],
    BranchEvent: [
      'PullRequestCommentEvent',
      'PullRequestEvent',
      'PullRequestReviewCommentEvent',
      'PullRequestReviewEvent',
    ],
    RepositoryEvent: ['InstallationEvent'],
    ProjectEvent: [
      'PullRequestCommentEvent',
      'PullRequestEvent',
      'PullRequestReviewCommentEvent',
      'PullRequestReviewEvent',
    ],
    TeamEvent: ['TeamSubscriptionEvent'],
  },
};
export default result;
