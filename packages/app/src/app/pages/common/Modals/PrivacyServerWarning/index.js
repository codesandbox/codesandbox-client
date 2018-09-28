import React from 'react';

import { Container, Heading, Explanation } from '../elements';

export default () => (
  <Container>
    <Heading>Private Server Sandbox Notice</Heading>
    <Explanation>
      You{"'"}re making a server sandbox private. Currently this means that the
      files will be private, but the preview URL itself will be accessible by
      others. We are working on new security functionality that will make the
      preview URL private as well.
    </Explanation>
  </Container>
);
