import React from 'react';

import { useOvermind } from 'app/overmind';
import Loadable from 'app/utils/Loadable';

import { Heading, Container } from '../elements';

const Feedback = Loadable(() =>
  import(/* webpackChunkName: 'feedback' */ './Feedback')
);

export const FeedbackModal: React.FC = () => {
  const {
    state: {
      user,
      editor: { currentId },
    },
  } = useOvermind();

  return (
    <Container>
      <Heading>Submit Feedback</Heading>

      <Feedback user={user} id={currentId} />
    </Container>
  );
};
