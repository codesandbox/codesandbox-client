import {
  GetSandboxWithTemplateQuery,
  TemplateFragment,
} from 'app/graphql/types';
import { PrivacyLevel, SandboxToFork, TemplateCollection } from './types';

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
    author: template.sandbox.team?.name || 'CodeSandbox',
    type: template.sandbox.isV2 ? 'devbox' : 'sandbox',
    tags: [],
    forkCount: template.sandbox.forkCount,
    viewCount: template.sandbox.viewCount,
    iconUrl: template.iconUrl || undefined,
    sourceTemplate: template.sandbox.source?.template || undefined,
  };
};

export const mapSandboxGQLResponseToSandboxToFork = (
  sandbox: NonNullable<GetSandboxWithTemplateQuery['sandbox']>
): SandboxToFork => ({
  id: sandbox.id,
  alias: sandbox.alias,
  title: sandbox.title,
  description: sandbox.description,
  author: sandbox.team?.name || 'CodeSandbox',
  type: sandbox.isV2 ? 'devbox' : 'sandbox',
  forkCount: sandbox.forkCount,
  viewCount: sandbox.viewCount,
  iconUrl: sandbox.customTemplate?.iconUrl || undefined,
  sourceTemplate: sandbox.source?.template || undefined,
  tags: [],
});

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

export const getTemplatesInCollections = (
  templates: SandboxToFork[],
  collections: Array<{ tag: string; title: string }>
): TemplateCollection[] => {
  const result: TemplateCollection[] = [];
  collections.forEach(collection => {
    result.push({
      key: collection.tag,
      title: collection.title,
      templates: templates.filter(template =>
        template.tags.includes(collection.tag)
      ),
    });
  });
  return result;
};

interface Params {
  searchQuery?: string;
  officialTemplates: SandboxToFork[];
  teamTemplates: SandboxToFork[];
}

export const getAllMatchingTemplates = ({
  officialTemplates,
  teamTemplates,
  searchQuery,
}: Params): SandboxToFork[] => {
  // Using a map to ensure unique entries for templates
  const allTemplatesMap: Map<string, SandboxToFork> = new Map();

  officialTemplates.forEach(t => {
    allTemplatesMap.set(t.id, t);
  });

  teamTemplates.forEach(t => {
    allTemplatesMap.set(t.id, t);
  });

  const query = searchQuery ? searchQuery.trim().toLowerCase() : null;
  return Array.from(allTemplatesMap.values()).filter(t =>
    query
      ? (t.title || t.alias || '').toLowerCase().includes(query) ||
        t.tags.some(tag => tag.includes(query))
      : true
  );
};

export function parsePrivacy(
  privacy: string | undefined
): PrivacyLevel | undefined {
  if (privacy === 'public') {
    return 0;
  }

  if (privacy === 'unlisted') {
    return 1;
  }

  if (privacy === 'private') {
    return 2;
  }

  return undefined;
}
