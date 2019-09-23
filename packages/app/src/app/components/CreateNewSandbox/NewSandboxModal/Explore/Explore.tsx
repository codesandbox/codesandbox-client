import React, { useState, useEffect } from 'react';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';
import * as algoliasearch from 'algoliasearch';
import { Header } from '../elements';
import { SandboxCard } from '../SandboxCard';
import { makeTemplates } from './utils';
import { GridList } from '../GridList';

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_DEFAULT_INDEX);

export const Explore = () => {
  const [templates, setTemplates] = useState();

  useEffect(() => {
    index
      .search({
        facetFilters: ['custom_template.published: true'],
        hitsPerPage: 50,
      })
      .then(rsp => setTemplates(makeTemplates(rsp.hits)));
  }, []);

  return (
    <>
      <Header>
        <span>Explore Templates</span>
      </Header>

      {templates ? (
        <GridList>
          {templates.map(sandbox => (
            <SandboxCard key={sandbox.objectID} template={sandbox} />
          ))}
        </GridList>
      ) : null}
    </>
  );
};
