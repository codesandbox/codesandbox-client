import React from 'react';
import { Container, Row } from './elements';

function getFontFamily(search) {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const family = hashes
    .find(hash => hash.split('=')[0] === 'family')
    .split('=')[1];

  return family.split('+').join(' ');
}

function getName(resource) {
  if (resource.includes('https://fonts.googleapis.com/css')) {
    return `${getFontFamily(resource)} (Google Fonts)`;
  }

  if (resource.endsWith('.css') || resource.endsWith('.js')) {
    const match = resource.match(/.*\/(.*)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // Add trailing / but no double one
  const normalizedUrl = `${resource.replace(/\/$/g, '')}/`;

  return normalizedUrl;
}

function ExternalResources({ sandbox }) {
  const externalResources = sandbox.externalResources || [];

  return (
    <Container>
      {externalResources.length > 0 && (
        <>
          {externalResources.map(dep => (
            <Row key={dep}>
              <span>{getName(dep)}</span>
              <a href={dep} rel="nofollow noopener noreferrer" target="_blank">
                open
              </a>
            </Row>
          ))}
        </>
      )}
    </Container>
  );
}

export default ExternalResources;
