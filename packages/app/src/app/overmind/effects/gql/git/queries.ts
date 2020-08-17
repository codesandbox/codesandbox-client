import {
  GitSandboxesQuery,
  GitSandboxesQueryVariables,
} from 'app/graphql/types';
import { Query, gql } from 'overmind-graphql';

export const getForks: Query<
  GitSandboxesQuery,
  GitSandboxesQueryVariables
> = gql`
  query GitSandboxes(
    $branch: String!
    $path: String!
    $repo: String!
    $username: String!
    $teamId: UUID4
  ) {
    git(branch: $branch, path: $path, repo: $repo, username: $username) {
      baseGitSandboxes(teamId: $teamId) {
        id
        title
        prNumber
      }
      originalGitSandboxes(teamId: $teamId) {
        id
        title
        prNumber
      }
    }
  }
`;
