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
    custom_template: {
      id: string;
      icon_url: string;
      color: string;
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
    },
  })),
});

export const getTemplateInfosFromAPI = (
  url: string
): Promise<ITemplateInfo[]> =>
  fetch(url)
    .then(res => res.json())
    .then((body: IExploreTemplate[]) => body.map(mapAPIResponseToTemplateInfo));
