import React from 'react';
import HomeIcon from 'react-icons/lib/io/home';
import { Highlight } from 'react-instantsearch/dom';
import styled from 'styled-components';

import Select from 'app/components/Select';
import Tooltip from 'common/components/Tooltip';

import GitHubLogo from '../Git/modals/GitHubLogo';
import formatDownloads from './formatDownloads';

const Container = styled.div`
  display: flex;
  background: ${props =>
    props.highlighted ? props.theme.background3 : props.theme.background2};
  color: ${props => props.theme.white};
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.background3};
  }
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

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

const IconLink = styled.a`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

type Props = {
  highlighted: boolean,
  hit: Object,
  onClick: Function,
  onVersionChange: Function,
};

type State = {
  selectedVersion: string,
};

const initialState: State = {
  selectedVersion: '',
};

export default class DependencyHit extends React.PureComponent {
  props: Props;
  state = initialState;

  makeGitHubRepoUrl(repo) {
    return `https://github.com/${repo.user}/${repo.project}`;
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  handleVersionChange = e => {
    const selectedVersion = e.target.value;
    this.setState({ selectedVersion });
    this.props.onVersionChange(selectedVersion);
  };

  render() {
    const { highlighted, hit, onClick } = this.props;
    const versions = Object.keys(hit.versions);
    versions.reverse();
    return (
      <Container highlighted={highlighted} onClick={onClick}>
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
              <Tooltip title={`GitHub repository of ${hit.name}`}>
                <IconLink
                  href={this.makeGitHubRepoUrl(hit.githubRepo)}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={this.stopPropagation}
                >
                  <GitHubLogo />
                </IconLink>
              </Tooltip>
            )}
            {hit.homepage && (
              <Tooltip title={`Homepage of ${hit.name}`}>
                <IconLink
                  href={hit.homepage}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={this.stopPropagation}
                >
                  <HomeIcon />
                </IconLink>
              </Tooltip>
            )}
            <Select
              onClick={this.stopPropagation}
              onChange={this.handleVersionChange}
              value={this.state.selectedVersion}
            >
              {versions.map(v => <option key={v}>{v}</option>)}
            </Select>
          </Row>
        </Right>
      </Container>
    );
  }
}
