import { useAppState } from 'app/overmind';
import { Loadable } from 'app/utils/Loadable';
import React, { FunctionComponent } from 'react';

const Feedback = Loadable(() =>
  import(/* webpackChunkName: 'feedback' */ './Feedback').then(module => ({
    default: module.Feedback,
  }))
);

export const FeedbackModal: FunctionComponent = () => {
  const { user } = useAppState();

  return <Feedback user={user} />;
};
