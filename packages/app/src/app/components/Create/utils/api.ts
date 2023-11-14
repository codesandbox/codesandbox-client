import { TemplateType } from '@codesandbox/common/lib/templates';
import { isServer } from '@codesandbox/common/lib/templates/helpers/is-server';
import { TemplateInfo } from './types';

interface IExploreTemplate {
  title: string;
  sandboxes: {
    id: string;
    title: string | null;
    alias: string | null;
    description: string | null;
    inserted_at: string;
    updated_at: string;
    author: { username: string } | null;
    environment: TemplateType;
    v2?: boolean;
    custom_template: {
      id: string;
      icon_url: string;
      color: string;
    };
    collection?: {
      team: {
        name: string;
      };
    };
    git: {
      id: string;
      username: string;
      commit_sha: string;
      path: string;
      repo: string;
      branch: string;
    };
  }[];
}

const mapAPIResponseToTemplateInfo = (
  exploreTemplate: IExploreTemplate
): TemplateInfo => ({
  key: exploreTemplate.title,
  title: exploreTemplate.title,
  templates: exploreTemplate.sandboxes.map(sandbox => ({
    id: sandbox.custom_template.id,
    color: sandbox.custom_template.color,
    iconUrl: sandbox.custom_template.icon_url,
    published: true,
    sandbox: {
      id: sandbox.id,
      insertedAt: sandbox.inserted_at,
      updatedAt: sandbox.updated_at,
      alias: sandbox.alias,
      title: sandbox.title,
      author: sandbox.author,
      description: sandbox.description,
      source: {
        template: sandbox.environment,
      },
      // TODO: Update /official and /essential endpoints to return
      // team -> name instead of collection -> team -> name
      team: {
        name: 'CodeSandbox',
      },
      isV2: sandbox.v2,
      isSse: isServer(sandbox.environment),
      git: sandbox.git && {
        id: sandbox.git.id,
        username: sandbox.git.username,
        commitSha: sandbox.git.commit_sha,
        path: sandbox.git.path,
        repo: sandbox.git.repo,
        branch: sandbox.git.branch,
      },
    },
  })),
});

export const getTemplateInfosFromAPI = (url: string): Promise<TemplateInfo[]> =>
  fetch(url)
    .then(res => res.json())
    .then((body: IExploreTemplate[]) => body.map(mapAPIResponseToTemplateInfo));

type ValidateRepositoryDestinationFn = (
  destination: string
) => Promise<{ valid: boolean; message?: string }>;

/**
 * @param destination In the format of `owner/repo`
 */
export const validateRepositoryDestination: ValidateRepositoryDestinationFn = destination => {
  // Get the authentication token from local storage if it exists.
  const token = localStorage.getItem('devJwt');

  return fetch(`/api/beta/repos/validate/github/${destination}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-codesandbox-client': 'legacy-web',
      authorization: token ? `Bearer ${token}` : '',
    },
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }

      return res;
    })
    .then(res => res.json());
};
