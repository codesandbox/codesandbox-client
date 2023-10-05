import React from 'react';
import { formatVersion } from '@codesandbox/common/lib/utils/ci';
import { packageExamplesUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Container, Row, Link } from './elements';

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
          <Link href={packageExamplesUrl(dep)} target="_blank">
            {dep}
          </Link>
          <span>{formatVersion(npmDependencies[dep])}</span>
        </Row>
      ))}
    </Container>
  );
}

export default Dependencies;
