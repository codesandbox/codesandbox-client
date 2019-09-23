import React, { useState, useEffect } from 'react';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';
import * as algoliasearch from 'algoliasearch';
import { Header } from '../elements';
import { SandboxCard } from '../SandboxCard';
import { makeTemplates, useDebounce } from './utils';
import { ScrollableContent } from '../ScrollableContent';
import { Loader } from '../Loader';
import { SubHeader } from '../Create/elements';
import { Grid, Search, Categories } from './elements';
import { all } from '../availableTemplates';

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_DEFAULT_INDEX);

export const Explore = () => {
  const [templates, setTemplates] = useState();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const query = useDebounce(search, 300);

  useEffect(() => {
    index
      .search({
        facetFilters: ['custom_template.published: true', category],
        hitsPerPage: 50,
        query,
      })
      .then(rsp => setTemplates(makeTemplates(rsp.hits)));
  }, [category, page, query]);

  useEffect(() => {
    if (page !== 1) {
      index
        .search({
          facetFilters: ['custom_template.published: true', category],
          hitsPerPage: 50,
          query,
          page,
        })
        .then(rsp => setTemplates(t => t.concat(makeTemplates(rsp.hits))));
    }
  }, [category, page, query]);

  const updateCategory = e => setCategory(`template: ${e.target.value}`);

  return (
    <>
      <Header>
        <span>Explore Templates</span>
        <form>
          <Search value={search} onChange={e => setSearch(e.target.value)} />
          <Categories onChange={updateCategory}>
            <option selected> Categories</option>
            {all.map(template => (
              <option value={template.shortid}>{template.niceName}</option>
            ))}
          </Categories>
        </form>
      </Header>

      {templates ? (
        <ScrollableContent onBottomReached={() => setPage(p => p + 1)}>
          <SubHeader>All Templates</SubHeader>
          <Grid>
            {templates.map(sandbox => (
              <SandboxCard key={sandbox.objectID} template={sandbox} />
            ))}
          </Grid>
        </ScrollableContent>
      ) : (
        <Loader />
      )}
    </>
  );
};
