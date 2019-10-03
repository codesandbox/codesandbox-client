import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Button, Container, Explanation, Heading } from './elements';

export const ZenModeIntroductionModal: FunctionComponent = () => {
  const {
    actions: { modalClosed },
  } = useOvermind();

  return (
    <Container>
      <Heading>Zen Mode Explained</Heading>

      <Explanation>
        Zen Mode is perfect for giving instruction videos and presentations. You
        can toggle the sidebar by double tapping <kbd>shift</kbd>. You can leave
        Zen Mode by hovering over the file name above the editor and clicking
        the icon on the right.
      </Explanation>

      <Row justifyContent="space-around">
        <Button onClick={() => modalClosed()}>Close</Button>
      </Row>
    </Container>
  );
};
