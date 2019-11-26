import React, { useState, useEffect } from 'react';
import { Header } from '../elements';
import { SearchBox } from '../SearchBox';
import { SearchResults } from './SearchResults';
import { Loader } from '../Loader';
import { ITemplateInfo, TemplateList } from '../TemplateList';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/sandboxes/templates/explore')
      .then(res => res.json())
      .then(body => {
        setExploreTemplates(body);
        setLoading(false);
      });
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
            template: 'create-react-app',
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

      {loading ? (
        <Loader />
      ) : search ? (
        <SearchResults search={search} />
      ) : (
        <TemplateList templateInfos={templateInfos} />
      )}
    </>
  );
};
