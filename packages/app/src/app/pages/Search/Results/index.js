import React from 'react';

import { Hits, Pagination } from 'react-instantsearch/dom';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import SandboxCard from '@codesandbox/common/lib/components/SandboxCard';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import getSandboxName from '@codesandbox/common/lib/utils/get-sandbox-name';

import ResultInfo from '../ResultInfo';
import { Container } from './elements';

const Results = () => {
  const selectSandbox = hit =>
    window.open(
      sandboxUrl({ id: hit.objectID, alias: hit.alias, git: hit.git })
    );

  return (
    <Container>
      <ResultInfo />
      <Margin bottom={2}>
        <Hits
          hitComponent={({ hit }) => (
            <SandboxCard
              selectSandbox={() => selectSandbox(hit)}
              noHeight
              sandbox={{
                ...hit,
                title: getSandboxName({
                  id: hit.objectID,
                  alias: hit.alias,
                  git: hit.git,
                }),
                id: hit.objectID,
              }}
            />
          )}
        />
      </Margin>
      <Centered horizontal>
        <Pagination />
      </Centered>
    </Container>
  );
};

export default Results;
