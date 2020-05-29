import Tooltip from '@codesandbox/common/es/components/Tooltip';
import compareVersions from 'compare-versions';
import React from 'react';
import { GoSearch } from 'react-icons/go';
import { IoHome } from 'react-icons/io';
import { Highlight } from 'react-instantsearch/dom';

import formatDownloads from '../formatDownloads';
import {
  Container,
  Description,
  Downloads,
  GitHubLogoStyled,
  IconLink,
  Left,
  License,
  Right,
  Row,
  StyledSelect,
  StyledUserWithAvatar,
} from './elements';

const getDefaultSelectedVersion = tags => {
  if (!tags) {
    return '';
  }

  if (!tags.latest) {
    return '';
  }

  return tags.latest;
};

export default class DependencyHit extends React.PureComponent {
  state = {
    selectedVersion: getDefaultSelectedVersion(this.props.hit.tags),
  };

  makeGitHubRepoUrl(repo) {
    return `https://github.com/${repo.user}/${repo.project}`;
  }

  makeSearchUrl(hitName) {
    return `${process.env.CODESANDBOX_HOST}/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${hitName}&page=1`;
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

    if (!hit.versions) {
      if (hit.version) {
        hit.versions = [hit.version];
      } else {
        return null;
      }
    }

    const versions = Object.keys(hit.versions).sort((a, b) => {
      try {
        return compareVersions(b, a);
      } catch (e) {
        return 0;
      }
    });

    const getTagName = (tags, version) =>
      Object.keys(tags).find(key => tags[key] === version);

    const validDescription = description =>
      description &&
      !description.includes('&lt') &&
      !description.includes('&gt') &&
      !description.includes('[![');

    return (
      <Container highlighted={highlighted} onClick={onClick}>
        <Left>
          <Row>
            <Highlight attribute="name" hit={hit} />
            <Downloads>{formatDownloads(hit.downloadsLast30Days)}</Downloads>
            {hit.license && <License>{hit.license}</License>}
          </Row>
          {validDescription(hit.description) && (
            <Description>{hit.description}</Description>
          )}
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
              <Tooltip content={`GitHub repository of ${hit.name}`}>
                <IconLink
                  href={this.makeGitHubRepoUrl(hit.githubRepo)}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={this.stopPropagation}
                >
                  <GitHubLogoStyled />
                </IconLink>
              </Tooltip>
            )}
            {hit.homepage && (
              <Tooltip content={`Homepage of ${hit.name}`}>
                <IconLink
                  href={hit.homepage}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={this.stopPropagation}
                >
                  <IoHome />
                </IconLink>
              </Tooltip>
            )}
            <Tooltip content={`Search for sandboxes using ${hit.name}`}>
              <IconLink
                href={this.makeSearchUrl(hit.name)}
                target="_blank"
                rel="noreferrer noopener"
                onClick={this.stopPropagation}
              >
                <GoSearch />
              </IconLink>
            </Tooltip>
            {hit.tags && (
              <StyledSelect
                onClick={this.stopPropagation}
                onChange={this.handleVersionChange}
                value={this.state.selectedVersion}
              >
                {versions.map(v => {
                  const tagName = getTagName(hit.tags, v);
                  return (
                    <option value={v} key={v}>
                      {v} {tagName && `- ${tagName}`}
                    </option>
                  );
                })}
              </StyledSelect>
            )}
          </Row>
        </Right>
      </Container>
    );
  }
}
