import React, { useState, useEffect, useRef } from 'react';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';
import * as algoliasearch from 'algoliasearch';
import { useKey } from 'react-use';
import { Header } from '../elements';
import { SandboxCard } from '../SandboxCard';
import { makeTemplates, useDebounce } from './utils';
import { ScrollableContent } from '../ScrollableContent';
import { Loader } from '../Loader';
import { SubHeader } from '../Create/elements';
import { Grid, Search, Categories, Form, InputWrapper } from './elements';
import { all } from '../availableTemplates';

const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY);
const index = client.initIndex(ALGOLIA_DEFAULT_INDEX);

export const Explore = () => {
  const searchEl = useRef(null);
  const [templates, setTemplates] = useState();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const query = useDebounce(search, 300);
  useKey('/', () => {
    window.setTimeout(() => {
      searchEl.current.focus();
    });
  });

  useEffect(() => {
    index
      .search({
        facetFilters: ['custom_template.published: true', category],
        hitsPerPage: 50,
        query,
      })
      .then(rsp => setTemplates(makeTemplates(rsp.hits)));

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

  const updateCategory = e => {
    if (e.target.value !== '') {
      return setCategory(`template: ${e.target.value}`);
    }

    return setCategory('');
  };

  return (
    <>
      <Header>
        <span>Explore Templates</span>
        <Form>
          <InputWrapper>
            <Search
              value={search}
              placeholder="Search"
              ref={searchEl}
              onChange={e => setSearch(e.target.value)}
            />
          </InputWrapper>
          <Categories onChange={updateCategory}>
            <option selected> Categories</option>
            {all.map(template => (
              <option value={template.name}>{template.niceName}</option>
            ))}
          </Categories>
        </Form>
      </Header>

      {templates ? (
        <ScrollableContent onBottomReached={() => setPage(p => p + 1)}>
          {templates.length ? (
            <>
              <SubHeader>All Templates</SubHeader>
              <Grid>
                {templates.map(sandbox => (
                  <SandboxCard key={sandbox.objectID} template={sandbox} />
                ))}
              </Grid>
            </>
          ) : (
            <SubHeader
              css={`
                text-align: center;
              `}
            >
              Oh no
            </SubHeader>
          )}
        </ScrollableContent>
      ) : (
        <Loader />
      )}
    </>
  );
};
