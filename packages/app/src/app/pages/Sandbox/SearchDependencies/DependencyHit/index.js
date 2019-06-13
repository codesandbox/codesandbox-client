import React, { useState } from 'react';
import HomeIcon from 'react-icons/lib/io/home';
import SearchIcon from 'react-icons/lib/go/search';
import compareVersions from 'compare-versions';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import formatDownloads from '../formatDownloads';
import {
  Container,
  Left,
  Right,
  Row,
  AlignBottom,
  AlignRight,
  Description,
  Name,
  DownloadIcon,
  Downloads,
  LicenseIcon,
  License,
  IconLink,
  StyledSelect,
  StyledUserWithAvatar,
  GitHubLogoStyled,
  AddButton,
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

export const DependencyHit = ({
  hit,
  highlighted,
  onClick,
  onVersionChange,
}) => {
  const [selectedVersion, setSelectedVersion] = useState(
    getDefaultSelectedVersion(hit.tags)
  );

  const makeGitHubRepoUrl = repo =>
    `https://github.com/${repo.user}/${repo.project}`;

  const makeSearchUrl = hitName =>
    `${
      process.env.CODESANDBOX_HOST
    }/search?refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=${hitName}&page=1`;

  const handleVersionChange = e => {
    setSelectedVersion(e.target.value);
    onVersionChange(e.target.value);
  };

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

  return (
    <Container>
      <Left
        title="Add to Dependencies"
        highlighted={highlighted}
        onClick={val => onClick(val, false)}
      >
        <Row>
          <Name hit={hit} />
          <Downloads>
            <DownloadIcon />
            {formatDownloads(hit.downloadsLast30Days)}
          </Downloads>
          {hit.license && (
            <License>
              <LicenseIcon />
              {hit.license}
            </License>
          )}
        </Row>
        <Description>{hit.description}</Description>
        <AlignBottom>
          <StyledUserWithAvatar
            username={hit.owner.name}
            avatarUrl={hit.owner.avatar}
          />
        </AlignBottom>
      </Left>
      <Right>
        <AlignRight>
          {hit.githubRepo && (
            <Tooltip content={`GitHub repository of ${hit.name}`}>
              <IconLink href={makeGitHubRepoUrl(hit.githubRepo)}>
                <GitHubLogoStyled />
              </IconLink>
            </Tooltip>
          )}
          {hit.homepage && (
            <Tooltip content={`Homepage of ${hit.name}`}>
              <IconLink href={hit.homepage}>
                <HomeIcon />
              </IconLink>
            </Tooltip>
          )}
          <Tooltip content={`Search for sandboxes using ${hit.name}`}>
            <IconLink href={makeSearchUrl(hit.name)}>
              <SearchIcon />
            </IconLink>
          </Tooltip>
        </AlignRight>
        <Row>
          <StyledSelect onChange={handleVersionChange} value={selectedVersion}>
            {versions.map(v => {
              const tagName = getTagName(hit.tags, v);
              return (
                <option value={v} key={v}>
                  {v} {tagName && `- ${tagName}`}
                </option>
              );
            })}
          </StyledSelect>
        </Row>
        <Row>
          <AddButton onClick={onClick}>Add Dependency</AddButton>
        </Row>
        <Row>
          <AddButton onClick={event => onClick(event, true)}>
            Add DevDependency
          </AddButton>
        </Row>
      </Right>
    </Container>
  );
};
