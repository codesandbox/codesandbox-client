import { TemplateFragment } from 'app/graphql/types';
import { TemplateCollection } from '../utils/types';

interface UseAllTemplatesParams {
  searchQuery?: string;
  officialTemplates: TemplateFragment[];
  teamTemplates: TemplateFragment[];
  collections: TemplateCollection[];
}

export const useAllTemplates = ({
  officialTemplates,
  teamTemplates,
  collections,
  searchQuery,
}: UseAllTemplatesParams) => {
  // Using a map to ensure unique entries for templates
  const allTemplatesMap: Map<string, TemplateFragment> = new Map();

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
      ? (t.sandbox.alias || t.sandbox.alias || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true
  );
};
