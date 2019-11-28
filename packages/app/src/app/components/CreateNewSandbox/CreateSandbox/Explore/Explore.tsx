import React, { useState, useEffect } from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { TemplateType } from '@codesandbox/common/lib/templates';
import { Header } from '../elements';
import { SearchBox } from '../SearchBox';
import { SearchResults } from './SearchResults';
import { Loader } from '../Loader';
import { ITemplateInfo } from '../TemplateList';
import { DynamicWidthTemplateList } from '../DynamicWidthTemplateList';

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

type ExploreResponse = IExploreTemplate[];

export const Explore = () => {
  const [search, setSearch] = useState('');
  const [exploreTemplates, setExploreTemplates] = useState<ExploreResponse>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let loaded = false;
    const timeout = window.setTimeout(() => {
      // We only show the loading screen 600ms after opening the component
      // and if the data hasn't been loaded yet. This is to save people from
      // seeing a flickering
      if (!loaded) {
        setLoading(true);
      }
    }, 600);

    fetch('/api/v1/sandboxes/templates/explore')
      .then(res => res.json())
      .then(body => {
        setExploreTemplates(body);
        setLoading(false);

        loaded = true;
      });

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const templateInfos: ITemplateInfo[] = exploreTemplates.map(
    exploreTemplate => ({
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
    })
  );

  return (
    <>
      <Header>
        <span>Explore Templates</span>
        <div>
          <SearchBox
            onChange={evt => setSearch(evt.target.value)}
            value={search}
            placeholder="Search Public Templates"
          />
        </div>
      </Header>

      <Scrollable>
        {loading ? (
          <Loader />
        ) : search ? (
          <SearchResults search={search} />
        ) : (
          <DynamicWidthTemplateList
            forkOnOpen={false}
            templateInfos={templateInfos}
          />
        )}
      </Scrollable>
    </>
  );
};
