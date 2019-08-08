import React from 'react';
import { inject } from 'app/componentConnectors';

import { Container, Heading, Explanation } from '../elements';

function LiveVersionMismatch() {
  return (
    <Container>
      <Heading>Version Mismatch</Heading>
      <Explanation>
        You are running an older version of CodeSandbox. Refresh to get the
        latest version.
        <p>
          If refreshing doesn
          {"'"}t work, you can try to clear your storage and unregister the
          service worker.
        </p>
      </Explanation>
    </Container>
  );
}

export default inject('store')(LiveVersionMismatch);
