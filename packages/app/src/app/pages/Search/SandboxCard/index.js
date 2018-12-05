import React from 'react';
import { Highlight } from 'react-instantsearch/dom';

import Tags from 'common/components/Tags';

import { sandboxUrl } from 'common/utils/url-generator';

import SandboxInfo from './SandboxInfo';

import {
  Container,
  StyledLink,
  Title,
  Description,
  TagContainer,
  Header,
} from './elements';

function SandboxCard({ hit }) {
  return (
    <StyledLink to={sandboxUrl({ id: hit.objectID, git: hit.git })}>
      <Container template={hit.template}>
        <Header alignItems="flex-start">
          <Title>
            {hit.title ? (
              <Highlight attribute="title" hit={hit} />
            ) : (
              hit.objectID
            )}
          </Title>
          <TagContainer>
            <Tags
              align="right"
              style={{ margin: 0, marginTop: -2 }}
              tags={(hit.tags || []).filter(tag => tag.length < 20)}
            />
          </TagContainer>
        </Header>
        <Description>
          <Highlight attribute="description" hit={hit} />
        </Description>

        <SandboxInfo
          git={hit.git}
          author={hit.author}
          updatedAt={hit.updated_at}
          viewCount={hit.view_count}
          forkCount={hit.fork_count}
          likeCount={hit.like_count}
        />
      </Container>
    </StyledLink>
  );
}

export default SandboxCard;
