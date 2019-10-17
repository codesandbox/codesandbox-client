import React from 'react';
import { Container, Row } from './elements';

function Dependencies({ sandbox }) {
  let { npmDependencies } = sandbox;

  const packageJSON = sandbox.modules.find(
    m => m.title === 'package.json' && m.directoryShortid == null
  );

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
      {Object.keys(npmDependencies).map(dep => (
        <Row key={dep}>
          <span>{dep}</span>
          <span>{npmDependencies[dep]}</span>
        </Row>
      ))}
    </Container>
  );
}

export default Dependencies;
