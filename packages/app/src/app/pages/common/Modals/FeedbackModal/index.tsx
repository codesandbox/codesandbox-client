import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import Loadable from 'app/utils/Loadable';

import { Container, Heading } from '../elements';

const Feedback = Loadable(() =>
  import(/* webpackChunkName: 'feedback' */ './Feedback')
);

export const FeedbackModal: FunctionComponent = () => {
  const {
    state: {
      editor: { currentId },
      user,
    },
  } = useOvermind();

  return (
    <Container>
      <Heading>Submit Feedback</Heading>

      <Feedback user={user} id={currentId} />
    </Container>
  );
};
