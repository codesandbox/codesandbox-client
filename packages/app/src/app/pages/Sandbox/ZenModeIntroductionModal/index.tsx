import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

const ZenModeIntroduction: FunctionComponent = () => {
  const {
    actions: { modalClosed },
  } = useOvermind();

  return (
    <Container>
      <Heading>Zen Mode Explained</Heading>
      <Explanation>
        Zen Mode is perfect for giving instruction videos and presentations. You
        can toggle the sidebar by double tapping <code>shift</code>. You can
        leave Zen Mode by hovering over the file name above the editor and
        clicking the icon on the right.
      </Explanation>

      <Row justifyContent="space-around">
        <Button style={{ marginRight: '.5rem' }} onClick={() => modalClosed()}>
          Close
        </Button>
      </Row>
    </Container>
  );
};

export default ZenModeIntroduction;
