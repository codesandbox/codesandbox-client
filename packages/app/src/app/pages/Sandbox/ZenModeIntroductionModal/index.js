import React from 'react';
import { inject } from 'mobx-react';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

function ZenModeIntroduction({ signals }) {
  return (
    <Container>
      <Heading>Zen Mode Explained</Heading>
      <Explanation>
        Zen Mode is perfect for giving instruction videos and presentations. You
        can toggle the sidebar by double tapping <tt>shift</tt>. You can leave
        Zen Mode by hovering over the file name above the editor and clicking
        the icon on the right.
      </Explanation>

      <Row justifyContent="space-around">
        <Button
          style={{ marginRight: '.5rem' }}
          onClick={() => {
            signals.closeModal();
          }}
        >
          Close
        </Button>
      </Row>
    </Container>
  );
}

export default inject('signals')(ZenModeIntroduction);
