import { TemplateType } from '@codesandbox/common/lib/templates';
import { ITemplateInfo } from '../TemplateList';

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
): ITemplateInfo => ({
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

export const getTemplateInfosFromAPI = (
  url: string
): Promise<ITemplateInfo[]> =>
  fetch(url)
    .then(res => res.json())
    .then((body: IExploreTemplate[]) => body.map(mapAPIResponseToTemplateInfo));
