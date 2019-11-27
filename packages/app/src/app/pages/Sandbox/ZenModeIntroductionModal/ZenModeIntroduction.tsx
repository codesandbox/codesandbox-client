import React from 'react';
import { useOvermind } from 'app/overmind';
import Row from '@codesandbox/common/lib/components/flex/Row';
import { Container, Heading, Explanation, Close } from './elements';

export const ZenModeIntroduction: React.FC = () => {
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
        <Close onClick={() => modalClosed()}>Close</Close>
      </Row>
    </Container>
  );
};
