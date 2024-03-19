import { SandboxToFork, TemplateCollection } from '../utils/types';

interface UseAllTemplatesParams {
  searchQuery?: string;
  featuredTemplates: SandboxToFork[];
  officialTemplates: SandboxToFork[];
  teamTemplates: SandboxToFork[];
  collections: TemplateCollection[];
}

export const useAllTemplates = ({
  featuredTemplates,
  officialTemplates,
  teamTemplates,
  collections,
  searchQuery,
}: UseAllTemplatesParams) => {
  // Using a map to ensure unique entries for templates
  const allTemplatesMap: Map<string, SandboxToFork> = new Map();

  featuredTemplates.forEach(t => {
    allTemplatesMap.set(t.id, t);
  });

  officialTemplates.forEach(t => {
    allTemplatesMap.set(t.id, t);
  });

  teamTemplates.forEach(t => {
    allTemplatesMap.set(t.id, t);
  });

  collections.forEach(c => {
    c.templates.forEach(t => {
      allTemplatesMap.set(t.id, t);
    });
  });

  return Array.from(allTemplatesMap.values()).filter(t =>
    searchQuery
      ? (t.title || t.alias || '')
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      : true
  );
};
