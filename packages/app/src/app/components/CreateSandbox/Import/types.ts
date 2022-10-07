import { GetGithubRepoQuery } from 'app/graphql/types';

export type GithubRepoToImport = NonNullable<GetGithubRepoQuery['githubRepo']>;
