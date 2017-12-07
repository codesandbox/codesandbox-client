import React from 'react';
import HomeIcon from 'react-icons/lib/io/home';
import SearchIcon from 'react-icons/lib/go/search';
import { Highlight } from 'react-instantsearch/dom';
import styled from 'styled-components';

import Select from 'app/components/Select';
import UserWithAvatar from 'app/components/user/UserWithAvatar';
import Tooltip from 'common/components/Tooltip';

import GitHubLogo from '../Git/modals/GitHubLogo';
import formatDownloads from './formatDownloads';

const Container = styled.div`
  display: flex;
  background: ${props =>
    props.highlighted
      ? props.theme.background2.darken(0.3)
      : props.theme.background2};
  color: ${props => props.theme.white};
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.background3};
  }

  &:hover {
    background-color: ${props => props.theme.background2.darken(0.2)};
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

const Description = Row.extend`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
`;

const Downloads = styled.span`
  color: ${props => props.theme.gray};
  font-weight: 500;
  font-size: 12px;
`;

const License = styled.span`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 3px;
  padding: 1px 3px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
`;

const IconLink = styled.a`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const StyledSelect = Select.extend`
  font-size: 0.875rem;
`;

const StyledUserWithAvatar = styled(UserWithAvatar)`
  font-size: 0.75rem;
  font-weight: 500;
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

export default class DependencyHit extends React.PureComponent {
  props: Props;
  state: State = {
    selectedVersion: this.props.hit.tags
      ? this.props.hit.tags.latest || ''
      : '',
  };

  makeGitHubRepoUrl(repo) {
    return `https://github.com/${repo.user}/${repo.project}`;
  }

  makeSearchUrl(hitName: string) {
    return `https://codesandbox.io/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${
      hitName
    }&page=1`;
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
          <Description>{hit.description}</Description>
          <Row>
            <StyledUserWithAvatar
              username={hit.owner.name}
              avatarUrl={hit.owner.avatar}
            />
          </Row>
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
            <Tooltip title={`Search for sandboxes using ${hit.name}`}>
              <IconLink
                href={this.makeSearchUrl(hit.name)}
                target="_blank"
                rel="noreferrer noopener"
                onClick={this.stopPropagation}
              >
                <SearchIcon />
              </IconLink>
            </Tooltip>
            <StyledSelect
              onClick={this.stopPropagation}
              onChange={this.handleVersionChange}
              value={this.state.selectedVersion}
            >
              {versions.map(v => <option key={v}>{v}</option>)}
            </StyledSelect>
          </Row>
        </Right>
      </Container>
    );
  }
}
