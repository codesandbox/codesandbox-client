import { SandboxToFork } from '../utils/types';

interface UseFeaturedTemplatesParams {
  recentTemplates: SandboxToFork[];
  officialTemplates: SandboxToFork[];
}

const FEATURED_IDS = [
  '9qputt', // react (vite + ts)
  'wmhfhw', // javascript-devbox
  'kcd5jq', // html-css-devbox
  'fxis37', // next
  'k5hn76', // next.js + postgres
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
      !recentlyUsedTemplates.find(t => t.id === id) &&
      officialTemplates.find(t => t.id === id)
  ).filter(Boolean);

  return featuredOfficialTemplates.slice(0, hasRecentlyUsedTemplates ? 6 : 9);
};
