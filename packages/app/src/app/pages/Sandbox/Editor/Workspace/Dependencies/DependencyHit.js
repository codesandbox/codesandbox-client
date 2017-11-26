import React from 'react';
import { Highlight } from 'react-instantsearch/dom';
import styled from 'styled-components';

import GitHubLogo from '../Git/modals/GitHubLogo';

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.gray};
  background: ${props => props.theme.background2};
  color: ${props => props.theme.white};
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div``;

const Row = styled.div`
  margin: 10px;
  & > * {
    margin-right: 10px;
  }
`;

const Downloads = styled.span`
  color: ${props => props.theme.gray};
  font-size: 12px;
`;

const License = styled.span`
  border: 1px solid ${props => props.theme.gray};
  border-radius: 3px;
  padding: 1px 3px;
  color: ${props => props.theme.gray};
  font-size: 12px;
`;

const GitHubContainer = styled.a`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

type Props = {
  hit: Object,
};

export default function DependencyHit({ hit }: Props) {
  return (
    <Container>
      <Left>
        <Row>
          <Highlight attributeName="name" hit={hit} />
          <Downloads>{formatDownloads(hit.downloadsLast30Days)}</Downloads>
          {hit.license && <License>{hit.license}</License>}
        </Row>
        <Row>{hit.description}</Row>
      </Left>
      <Right>
        <Row>
          {hit.githubRepo && (
            <GitHubContainer
              href={makeGitHubRepoUrl(hit.githubRepo)}
              target="_blank"
              rel="noreferrer noopener"
              onClick={stopPropagation}
            >
              <GitHubLogo />
            </GitHubContainer>
          )}
        </Row>
      </Right>
    </Container>
  );
}

export function hitComponent(makeOnClick) {
  return ({ hit }: { hit: Object }) => {
    const onClick = makeOnClick(hit);
    return (
      <div role="button" tabIndex={0} onClick={onClick}>
        <DependencyHit hit={hit} />
      </div>
    );
  };
}

export function formatDownloads(downloads) {
  if (downloads >= 1000000) {
    const x = Math.floor(downloads / 100000);
    const millions = x / 10;
    return millions + 'M';
  }
  if (downloads >= 1000) {
    const x = Math.floor(downloads / 100);
    const thousands = x / 10;
    return thousands + 'K';
  }
  return downloads.toString();
}

function makeGitHubRepoUrl(repo) {
  return `https://github.com/${repo.user}/${repo.project}`;
}

function stopPropagation(e) {
  e.stopPropagation();
}
