import { uniqBy } from 'lodash-es';
import getDefinition, { TemplateType } from '@codesandbox/common/lib/templates';
import {
  TemplateFragmentDashboardFragment,
  SandboxFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
} from 'app/graphql/types';
import { DashboardSyncedRepoSandbox } from '../types';

export type TemplateFilter = {
  id: string;
  color: () => string;
  name: string;
  niceName: string;
};

export function getPossibleTemplates(
  sandboxes: Array<
    | SandboxFragmentDashboardFragment
    | RepoFragmentDashboardFragment
    | TemplateFragmentDashboardFragment
    | DashboardSyncedRepoSandbox
  >
): TemplateFilter[] {
  if (!sandboxes) return [];
  return uniqBy(
    sandboxes.map(x => {
      // @ts-ignore TODO: check if we need to set this for template as well
      const templateId = x.source?.template as TemplateType;
      const template = getDefinition(templateId);

      return {
        id: templateId,
        color: template.color,
        name: template.name,
        niceName: template.niceName,
      };
    }),
    template => template.id
  );
}

export function shuffleSeed(array, inputSeed) {
  let seed = inputSeed || 1;

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  let index = -1;
  const lastIndex = length - 1;
  const result = [...array];
  while (++index < length) {
    const rand = index + Math.floor(random() * (lastIndex - index + 1));
    const value = result[rand];
    result[rand] = result[index];
    result[index] = value;
  }
  return result;
}

export const appendOnboardingTracking = (url: string): string => {
  const baseUrl = new URL(url);
  baseUrl.searchParams.append('utm_source', 'dashboard_onboarding');

  return baseUrl.toString();
};
