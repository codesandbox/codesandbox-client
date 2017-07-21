import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Highlight } from 'react-instantsearch/dom';

import Tags from 'app/components/sandbox/Tags';

import SandboxInfo from './SandboxInfo';
import { sandboxUrl } from '../../../utils/url-generator';

const Container = styled.div`
  transition: 0.3s ease all;

  position: relative;
  background-color: ${props => props.theme.background};
  padding: 1em;
  padding-bottom: 0.9em; /* strange styling issue, need to compensate */
  width: 100%;
  margin-bottom: 1rem;
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  box-sizing: border-box;

  border-left: 2px solid ${props => props.theme.secondary.clearer(0.3)};

  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.24);
    background-color: ${props => props.theme.background.lighten(0.1)};
  }
`;

const StyledLink = styled(Link)`
  text-transform: none;
  text-decoration: none;
  color: inherit;
`;

const Title = styled.h2`
  font-weight: 400;
  font-size: 1.25em;
  margin: 0;
  margin-bottom: 1rem;
  color: white;
`;

const Description = styled.p`
  font-size: .875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
`;

const TagContainer = styled.div`
  position: absolute;
  font-size: .75rem;
  right: 0;
  top: 0.25rem;
`;

type Props = {
  hit: {
    'view_count': number,
    'title': ?string,
    'npm_dependencies': Array<{ version: string, dependency: string }>,
    'like_count': number,
    'inserted_at': number,
    'updated_at': number,
    'git': ?{
      username: string,
      repo: string,
      commitSha: string,
      path: string,
    },
    'forked_sandbox': string,
    'fork_count': number,
    'external_resources': Array<string>,
    'description': ?string,
    'author': ?{ username: string, avatarUrl: string },
    'objectID': string,
  },
};

/**
 * A scientific method to determine how many tags to show
 */
const getTagCount = (title, tags) => {
  const textCount = title.length * 1.5 + tags.join('').length;

  if (textCount > 130) {
    return 0;
  }
  if (textCount > 120) {
    return 1;
  }
  if (textCount > 110) {
    return 2;
  }
  if (textCount > 100) {
    return 3;
  }
  if (textCount > 90) {
    return 4;
  }

  return 5;
};

export default ({ hit }: Props) =>
  <StyledLink to={sandboxUrl({ id: hit.objectID, git: hit.git })}>
    <Container>
      <Title>
        {hit.title
          ? <Highlight attributeName="title" hit={hit} />
          : hit.objectID}
      </Title>
      <TagContainer>
        <Tags
          tags={(hit.tags || [])
            .splice(0, getTagCount(hit.title || '', hit.tags || []))}
        />
      </TagContainer>
      <Description>
        <Highlight attributeName="description" hit={hit} />
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
  </StyledLink>;
