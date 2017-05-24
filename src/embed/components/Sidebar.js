import React from 'react';
import styled from 'styled-components';

import type { Sandbox } from 'common/types';

import EditorLink from './EditorLink';
import Files from './Files';
import EntryContainer
  from '../../app/pages/Sandbox/Editor/Workspace/EntryContainer';
import Padding from '../../app/components/spacing/Padding';

const Container = styled.div`
  flex: 250px;
  width: 250px;
  height: 100%;
  color: rgba(255, 255, 255, 0.8);
  z-index: 10;
  background-color: ${props => props.theme.background.darken(0.1)};
  overflow: auto;
`;

const Title = styled.h2`
  font-weight: 400;
  padding: 0 1rem;
  margin: 0;
  font-size: 1rem;
  line-height: 3rem;
  height: 3rem;
  vertical-align: middle;
  box-sizing: border-box;
`;

const Subtitle = styled.h3`
  font-size: .875rem;
  margin: 0.5rem 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
`;

const Description = styled.p`
  font-size: .875rem;
  padding: 0 1rem;
`;

const Item = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  ${({ hover, theme }) => hover && `&:hover { background-color: ${theme.background.darken(0.3)()};}`}
`;

const Version = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  right: 1rem;
  top: 0;
  bottom: 0;
  vertical-align: middle;
  line-height: 1em;
  color: rgba(255, 255, 255, 0.3);
`;

const Author = styled.div`
  font-size: .875rem;
  margin: 0 1rem;
  margin-bottom: 1rem;
`;

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

function getName(resource: string) {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    return resource.match(/.*\/(.*)/)[1];
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
}

type Props = {
  sandbox: Sandbox,
  setCurrentModule: (id: string) => void,
  currentModule: string,
};

export default ({ sandbox, setCurrentModule, currentModule }: Props) => (
  <Container>
    <Item>
      <Title>{sandbox.title || sandbox.id}</Title>
      {sandbox.author &&
        <Author>Made by <strong>{sandbox.author.username}</strong></Author>}
      {sandbox.description && <Description>{sandbox.description}</Description>}
    </Item>

    <Item>
      <Title>Files</Title>
      <Files
        modules={sandbox.modules}
        directories={sandbox.directories}
        directoryId={null}
        setCurrentModule={setCurrentModule}
        currentModule={currentModule}
      />
    </Item>

    <Item>
      <Title>Dependencies</Title>
      <Subtitle>NPM Dependencies</Subtitle>
      {Object.keys(sandbox.npmDependencies).map(dep => (
        <EntryContainer key={dep}>
          {dep}
          <Version>{sandbox.npmDependencies[dep]}</Version>
        </EntryContainer>
      ))}
      <Subtitle>External Resources</Subtitle>
      {sandbox.externalResources.map(dep => (
        <EntryContainer key={dep}>
          <a href={dep} rel="nofollow noopener noreferrer" target="_blank">
            {getName(dep)}
          </a>
        </EntryContainer>
      ))}
    </Item>
    <Item hover>
      <Padding margin={1}>
        <EditorLink id={sandbox.id} />
      </Padding>
    </Item>
  </Container>
);
