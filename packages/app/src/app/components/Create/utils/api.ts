import { TemplateType } from '@codesandbox/common/lib/templates';
import {
  GetSandboxWithTemplateQuery,
  TemplateFragment,
} from 'app/graphql/types';
import { SandboxToFork, TemplateCollection } from './types';

interface ExploreTemplateAPIResponse {
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
    fork_count: number;
    view_count: number;
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
  exploreTemplate: ExploreTemplateAPIResponse
): TemplateCollection => ({
  key: exploreTemplate.title,
  title: exploreTemplate.title,
  templates: exploreTemplate.sandboxes.map(sandbox => ({
    id: sandbox.id,
    alias: sandbox.alias,
    title: sandbox.title,
    description: sandbox.description,
    insertedAt: sandbox.inserted_at,
    updatedAt: sandbox.updated_at,
    isV2: sandbox.v2 || false,
    forkCount: sandbox.fork_count,
    viewCount: sandbox.view_count,
    iconUrl: sandbox.custom_template.icon_url,
    sourceTemplate: sandbox.environment,
    owner: 'CodeSandbox',
  })),
});

export const mapTemplateGQLResponseToSandboxToFork = (
  template: TemplateFragment
): SandboxToFork | null => {
  if (!template.sandbox) {
    return null;
  }

  return {
    id: template.sandbox.id,
    alias: template.sandbox.alias,
    title: template.sandbox.title,
    description: template.sandbox.description,
    insertedAt: template.sandbox.insertedAt,
    updatedAt: template.sandbox.updatedAt,
    isV2: template.sandbox.isV2 || false,
    forkCount: template.sandbox.forkCount,
    viewCount: template.sandbox.viewCount,
    iconUrl: template.iconUrl || undefined,
    sourceTemplate: template.sandbox.source?.template || undefined,
    owner: template.sandbox.team?.name || 'CodeSandbox',
  };
};

export const mapSandboxGQLResponseToSandboxToFork = (
  sandbox: NonNullable<GetSandboxWithTemplateQuery['sandbox']>
): SandboxToFork => ({
  id: sandbox.id,
  alias: sandbox.alias,
  title: sandbox.title,
  description: sandbox.description,
  insertedAt: sandbox.insertedAt,
  updatedAt: sandbox.updatedAt,
  isV2: sandbox.isV2 || false,
  forkCount: sandbox.forkCount,
  viewCount: sandbox.viewCount,
  iconUrl: sandbox.customTemplate?.iconUrl || undefined,
  sourceTemplate: sandbox.source?.template || undefined,
  owner: sandbox.team?.name || 'CodeSandbox',
});

export const getTemplateInfosFromAPI = (
  url: string
): Promise<TemplateCollection[]> =>
  fetch(url)
    .then(res => res.json())
    .then((body: ExploreTemplateAPIResponse[]) =>
      body.map(mapAPIResponseToTemplateInfo)
    );

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
