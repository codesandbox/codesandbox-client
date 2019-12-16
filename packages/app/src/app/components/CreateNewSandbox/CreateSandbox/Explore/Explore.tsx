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

export const Explore = () => {
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
        {loading ? (
          <Loader />
        ) : search ? (
          <SearchResults search={search} />
        ) : (
          <DynamicWidthTemplateList
            forkOnOpen={false}
            templateInfos={exploreTemplates}
          />
        )}
      </Scrollable>
    </>
  );
};
