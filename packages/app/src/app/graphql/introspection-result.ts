export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'BookmarkEntity',
        possibleTypes: [
          {
            name: 'Team',
          },
          {
            name: 'User',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'Repository',
        possibleTypes: [
          {
            name: 'GitHubRepository',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'ReferenceMetadata',
        possibleTypes: [
          {
            name: 'CodeReferenceMetadata',
          },
          {
            name: 'ImageReferenceMetadata',
          },
          {
            name: 'PreviewReferenceMetadata',
          },
          {
            name: 'UserReferenceMetadata',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'BranchEvent',
        possibleTypes: [
          {
            name: 'PullRequestCommentEvent',
          },
          {
            name: 'PullRequestEvent',
          },
          {
            name: 'PullRequestReviewCommentEvent',
          },
          {
            name: 'PullRequestReviewEvent',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'RepositoryEvent',
        possibleTypes: [
          {
            name: 'InstallationEvent',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'ProjectEvent',
        possibleTypes: [
          {
            name: 'PullRequestCommentEvent',
          },
          {
            name: 'PullRequestEvent',
          },
          {
            name: 'PullRequestReviewCommentEvent',
          },
          {
            name: 'PullRequestReviewEvent',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'TeamEvent',
        possibleTypes: [
          {
            name: 'TeamSubscriptionEvent',
          },
        ],
      },
    ],
  },
};
export default result;
