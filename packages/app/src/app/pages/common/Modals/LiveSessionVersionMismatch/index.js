import React from 'react';
import { inject } from 'mobx-react';

import VERSION, { getTimestamp } from 'common/version';

import { Container, Heading, Explanation } from '../elements';

function LiveVersionMismatch({ store }) {
  const newer =
    getTimestamp(store.live.roomInfo.version) > getTimestamp(VERSION);

  return (
    <Container>
      <Heading>Version Mismatch</Heading>
      <Explanation>
        The owner of this session has a{newer ? ' newer' : 'n older'} version of
        CodeSandbox.
        {newer
          ? ' Refresh to get the latest version.'
          : ' Ask the owner to refresh to get the latest version.'}
        <p>
          If refreshing doesn{"'"}t work, you can try to clear your storage and
          unregister the service worker.
        </p>
      </Explanation>
    </Container>
  );
}

export default inject('store')(LiveVersionMismatch);
