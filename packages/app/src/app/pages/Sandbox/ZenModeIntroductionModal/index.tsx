import * as React from 'react';
import { connect } from 'app/fluent';

import Button from 'app/components/Button';
import Row from 'common/components/flex/Row';

import { Container, Heading, Explanation } from './elements';

export default connect()
  .with(({ signals }) => ({
    closeModal: signals.closeModal
  }))
  .to(
    function ZenModeIntroduction({ closeModal }) {
      return (
        <Container>
          <Heading>Zen Mode Explained</Heading>
          <Explanation>
            Zen Mode is perfect for giving instruction videos and presentations. You
            can toggle the sidebar by double tapping <b>shift</b>. You can leave
            Zen Mode by hovering over the file name above the editor and clicking
            the icon on the right.
          </Explanation>

          <Row justifyContent="space-around">
            <Button
              style={{ marginRight: '.5rem' }}
              onClick={() => {
                closeModal();
              }}
            >
              Close
            </Button>
          </Row>
        </Container>
      );
    }
  )
