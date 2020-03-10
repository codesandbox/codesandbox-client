import React from 'react';
import { Element, Text } from '@codesandbox/components';

const LiveVersionMismatch = () => (
  <Element padding={4} paddingTop={6}>
    <Text weight="bold" block size={4} paddingBottom={2}>
      Version Mismatch
    </Text>
    <Text marginBottom={6} size={3} block>
      You are running an older version of CodeSandbox. Refresh to get the latest
      version.
      <br />
      <br />
      If refreshing doesn
      {"'"}t work, you can try to clear your storage and unregister the service
      worker.
    </Text>
  </Element>
);

export default LiveVersionMismatch;
