import { TemplateFragment } from 'app/graphql/types';

interface UseFeaturedTemplatesParams {
  recentTemplates: TemplateFragment[];
  officialTemplates: TemplateFragment[];
}

const FEATURED_IDS = [
  'new', // react
  'vanilla', // js
  'pb6sit', // vue
  'hsd8ke', // docker
  'fxis37', // next
  '9qputt', // react (vite + ts)
  'prp60l', // remix
  'angular', // angular
  'rjk9n4zj7m', // html/css
];

export const useFeaturedTemplates = ({
  recentTemplates,
  officialTemplates,
}: UseFeaturedTemplatesParams) => {
  const recentlyUsedTemplates = recentTemplates.slice(0, 3);

  const hasRecentlyUsedTemplates = recentlyUsedTemplates.length > 0;

  const featuredOfficialTemplates = FEATURED_IDS.map(
    id =>
      // If the template is already in recently used, don't add it twice
      !recentlyUsedTemplates.find(t => t.sandbox.id === id) &&
      officialTemplates.find(t => t.sandbox.id === id)
  ).filter(Boolean);

  return featuredOfficialTemplates.slice(0, hasRecentlyUsedTemplates ? 6 : 9);
};
