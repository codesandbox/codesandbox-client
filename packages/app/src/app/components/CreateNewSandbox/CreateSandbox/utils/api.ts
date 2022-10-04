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

export type ImportRepositoryFn = (_: {
  owner: string;
  name: string;
  csbTeamId: string;
}) => Promise<PartialImportedRepository>;

export const importRepository: ImportRepositoryFn = ({
  owner,
  name,
  csbTeamId,
}) => {
  return fetch(`/api/beta/import/github/${owner}/${name}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
