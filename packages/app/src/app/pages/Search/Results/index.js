import React from 'react';

import { Hits, Pagination } from 'react-instantsearch/dom';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import WideSandbox from '@codesandbox/common/lib/components/WideSandbox';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';

import ResultInfo from '../ResultInfo';
import { Container } from './elements';

function Results() {
  return (
    <Container>
      <ResultInfo />
      <Hits
        hitComponent={({ hit }) => (
          <WideSandbox
            selectSandbox={() =>
              window.open(sandboxUrl({ id: hit.objectID, git: hit.git }))
            }
            sandbox={{
              ...hit,
              title: hit.title || hit.objectID,
              id: hit.objectID,
            }}
          />
        )}
      />
      <Centered horizontal>
        <Pagination />
      </Centered>
    </Container>
  );
}

export default Results;
