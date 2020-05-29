import { formatVersion } from '@codesandbox/common/es/utils/ci';
import React from 'react';

import { Container, Link, Row } from './elements';

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
          <Link href={`/examples/package/${dep}`} target="_blank">
            {dep}
          </Link>
          <span>{formatVersion(npmDependencies[dep])}</span>
        </Row>
      ))}
    </Container>
  );
}

export default Dependencies;
