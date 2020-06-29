import React, { useState, useEffect } from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import track from '@codesandbox/common/lib/utils/analytics';
import { Header } from '../elements';
import { SearchBox } from '../SearchBox';
import { SearchResults } from './SearchResults';
import { Loader } from '../Loader';
import { ITemplateInfo } from '../TemplateList';
import { DynamicWidthTemplateList } from '../TemplateList/DynamicWidthTemplateList';
import { getTemplateInfosFromAPI } from '../utils/api';

interface ExploreProps {
  collectionId?: string;
}

export const Explore: React.FC<ExploreProps> = ({ collectionId }) => {
  const [search, setSearch] = useState('');
  const [exploreTemplates, setExploreTemplates] = useState<ITemplateInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'explore' });
  }, []);

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

    getTemplateInfosFromAPI('/api/v1/sandboxes/templates/explore').then(
      body => {
        setExploreTemplates(body);
        setLoading(false);

        loaded = true;
      }
    );

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const isLoading = (!exploreTemplates.length && !search) || loading;
  return (
    <>
      <Header>
        <span>Template Universe</span>
        <div>
          <SearchBox
            onChange={evt => setSearch(evt.target.value)}
            value={search}
            placeholder="Search Public Templates"
          />
        </div>
      </Header>
      <Scrollable>
        {isLoading ? <Loader /> : null}

        {search ? (
          <SearchResults search={search} />
        ) : (
          <DynamicWidthTemplateList
            forkOnOpen={false}
            templateInfos={exploreTemplates}
            collectionId={collectionId}
          />
        )}
      </Scrollable>
    </>
  );
};
