import { TemplateFragment } from 'app/graphql/types';

interface UseFeaturedTemplatesParams {
  recentTemplates: TemplateFragment[];
  officialTemplates: TemplateFragment[];
}

const FEATURED_IDS = [
  '9qputt', // react (vite + ts)
  'wmhfhw', // javascript-devbox
  'kcd5jq', // html-css-devbox
  'fxis37', // next
  'prp60l', // remix
  'pb6sit', // vue
  'angular', // angular
  'hsd8ke', // docker
  'in2qez', // python
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
