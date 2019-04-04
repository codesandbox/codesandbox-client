import React from 'react';

import { inject } from 'mobx-react';
import Loadable from 'app/utils/Loadable';

import { Heading, Container } from '../elements';

const Feedback = Loadable(() =>
  import(/* webpackChunkName: 'feedback' */ './Feedback')
);

const FeedbackModal = ({ store }) => (
  <Container>
    <Heading>Submit Feedback</Heading>

    <Feedback user={store.user} id={store.editor.currentId} />
  </Container>
);

export default inject('store')(FeedbackModal);
