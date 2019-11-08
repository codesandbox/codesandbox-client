import React, { useState } from 'react';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX, // eslint-disable-line
} from '@codesandbox/common/lib/utils/config';
import { InstantSearch, Configure, Stats } from 'react-instantsearch/dom';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { Header, SubHeader } from '../elements';
import { Categories, Form, GlobalSearchStyles } from './elements';
import { all } from '../availableTemplates';
import { ExploreResults } from './Results';
import { ExploreSearch } from './Search';

export const Explore = () => {
  const [category, setCategory] = useState('');

  const updateCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== '') {
      return setCategory(`template: ${e.target.value}`);
    }

    return setCategory('');
  };

  return (
    <>
      <GlobalSearchStyles />
      <InstantSearch
        appId={ALGOLIA_APPLICATION_ID}
        apiKey={ALGOLIA_API_KEY}
        indexName={ALGOLIA_DEFAULT_INDEX}
      >
        <Configure
          hitsPerPage={50}
          facetFilters={['custom_template.published: true', category]}
        />
        <Header>
          <span>Explore Templates</span>
          <Form>
            <ExploreSearch />

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

        <SubHeader>
          <Stats
            translations={{
              stats: nbHits => `${nbHits.toLocaleString()} results found`,
            }}
          />
        </SubHeader>

        <Scrollable>
          <ExploreResults />
        </Scrollable>
      </InstantSearch>
    </>
  );
};
