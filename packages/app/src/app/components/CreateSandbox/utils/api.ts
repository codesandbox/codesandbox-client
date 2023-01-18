import { TemplateType } from '@codesandbox/common/lib/templates';
import { TemplateInfo } from '../types';

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
      collection: sandbox.collection,
      isV2: sandbox.v2,
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

interface PartialImportedRepository {
  default_branch: string;
  is_v2: true;
  owner: string;
  repo: string;
  repo_private: boolean;
}

type ImportRepositoryFn = (_: {
  owner: string;
  name: string;
  csbTeamId: string;
}) => Promise<PartialImportedRepository>;

export const importRepository: ImportRepositoryFn = ({
  owner,
  name,
  csbTeamId,
}) => {
  // Get the authentication token from local storage if it exists.
  const token = localStorage.getItem('devJwt');

  return fetch(`/api/beta/import/github/${owner}/${name}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-codesandbox-client': 'legacy-web',
      authorization: token ? `Bearer ${token}` : '',
    },
    method: 'POST',
    body: JSON.stringify({
      team_id: csbTeamId,
    }),
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }

      return res;
    })
    .then(res => res.json());
};

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

type Source = {
  owner: string;
  name: string;
};
type Destination = {
  organization?: string;
  name: string;
  teamId: string;
};
type ForkRepositoryFn = (_: {
  source: Source;
  destination: Destination;
}) => Promise<PartialImportedRepository>;
export const forkRepository: ForkRepositoryFn = ({ source, destination }) => {
  // Get the authentication token from local storage if it exists.
  const token = localStorage.getItem('devJwt');

  let body: Record<string, string> = {
    name: destination.name,
    team_id: destination.teamId,
  };
  if (destination.organization) {
    body = { ...body, organization: destination.organization };
  }

  return fetch(`/api/beta/fork/github/${source.owner}/${source.name}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-codesandbox-client': 'legacy-web',
      authorization: token ? `Bearer ${token}` : '',
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }

      return res;
    })
    .then(res => res.json());
};
