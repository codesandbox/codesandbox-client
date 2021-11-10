import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

// TEMP: Launch the default branch
export const getFullGitHubUrl = (owner: string, repo: string) =>
  `${protocolAndHost()}/p/github/${owner}/${repo}`;
