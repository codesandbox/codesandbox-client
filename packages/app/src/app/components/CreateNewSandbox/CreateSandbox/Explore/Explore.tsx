import React, { useState, useEffect, useRef } from 'react';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';
import * as algoliasearch from 'algoliasearch';
import { useKey } from 'react-use';
import { makeTemplates as makeTemplatesMutation } from 'app/components/CreateNewSandbox/queries';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { Header } from '../elements';
import { SandboxCard } from '../SandboxCard';
import { makeTemplates, useDebounce } from './utils';
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
  const [allPages, setAllPages] = useState(1);
  const [page, setPage] = useState(0);
  const query = useDebounce(search, 300);
  useKey('/', () => {
    window.setTimeout(() => {
      searchEl.current.focus();
    });
  });

  useEffect(() => {
    if (query || category) {
      setPage(0);
    }
    if (page <= allPages) {
      index
        .search({
          facetFilters: ['custom_template.published: true', category],
          hitsPerPage: 50,
          query,
          page,
        })
        .then(rsp => {
          setAllPages(rsp.nbPages);
          const newTemplates = makeTemplates(rsp.hits);
          if (page === 0) return setTemplates(newTemplates);

          return setTemplates(t => t.concat(newTemplates));
        });
    }
  }, [allPages, category, page, query]);

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
            <option selected value="">
              Categories
            </option>
            {all.map(template => (
              <option value={template.name}>{template.niceName}</option>
            ))}
          </Categories>
        </Form>
      </Header>

      {templates ? (
        <Scrollable
          keepCalling={page <= allPages}
          onBottomReached={() => setPage(p => p + 1)}
        >
          {templates.length ? (
            <>
              <SubHeader>
                {category
                  ? all.find(
                      temp => temp.name === category.split(':')[1].trim()
                    ).niceName
                  : 'All'}{' '}
                Templates
              </SubHeader>
              <Grid>
                {templates.map(sandbox => (
                  <SandboxCard
                    onFollow={id => makeTemplatesMutation([id])}
                    key={sandbox.objectID}
                    template={sandbox}
                  />
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
        </Scrollable>
      ) : (
        <Loader />
      )}
    </>
  );
};
