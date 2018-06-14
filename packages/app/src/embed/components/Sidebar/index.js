// @flow
import * as React from 'react';

import type { Sandbox } from 'common/types';

import Padding from 'common/components/spacing/Padding';
import { EntryContainer } from 'app/pages/Sandbox/Editor/Workspace/elements';

import EditorLink from '../EditorLink';
import Files from '../Files';

import {
  Container,
  Title,
  Subtitle,
  Description,
  Item,
  Version,
  Author,
} from './elements';

const getNormalizedUrl = (url: string) => `${url.replace(/\/$/g, '')}/`;

function getName(resource: string) {
  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    const match = resource.match(/.*\/(.*)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Add trailing / but no double one
  return getNormalizedUrl(resource);
}

type Props = {
  sandbox: Sandbox,
  setCurrentModule: (id: string) => void,
  currentModule: string,
};

function Sidebar({ sandbox, setCurrentModule, currentModule }: Props) {
  const packageJSON = sandbox.modules.find(
    m => m.title === 'package.json' && m.directoryShortid == null
  );

  let npmDependencies = sandbox.npmDependencies;

  if (packageJSON) {
    try {
      npmDependencies = JSON.parse(packageJSON.code).dependencies;
    } catch (e) {
      console.error(e);
    }
  }

  npmDependencies = npmDependencies || {};

  return (
    <Container>
      <Item>
        <Title>{sandbox.title || sandbox.id}</Title>
        {sandbox.author && (
          <Author>
            Made by <strong>{sandbox.author.username}</strong>
          </Author>
        )}
        {sandbox.description && (
          <Description>{sandbox.description}</Description>
        )}
      </Item>

      <Item>
        <Title>Files</Title>
        <Files
          modules={sandbox.modules}
          directories={sandbox.directories}
          directoryId={null}
          setCurrentModule={setCurrentModule}
          currentModule={currentModule}
          template={sandbox.template}
          entry={sandbox.entry}
        />
      </Item>

      <Item>
        <Title>Dependencies</Title>

        <Subtitle>npm dependencies</Subtitle>
        {Object.keys(npmDependencies).map(dep => (
          <EntryContainer key={dep}>
            {dep}
            <Version>{npmDependencies[dep]}</Version>
          </EntryContainer>
        ))}

        {sandbox.externalResources.length > 0 && (
          <React.Fragment>
            <Subtitle>External Resources</Subtitle>
            {sandbox.externalResources.map(dep => (
              <EntryContainer key={dep}>
                <a
                  href={dep}
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                >
                  {getName(dep)}
                </a>
              </EntryContainer>
            ))}
          </React.Fragment>
        )}
      </Item>

      <Item hover>
        <Padding margin={1}>
          <EditorLink sandbox={sandbox} />
        </Padding>
      </Item>
    </Container>
  );
}

export default Sidebar;
