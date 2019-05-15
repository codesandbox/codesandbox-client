import React, { useState } from 'react';

import { inject } from 'mobx-react';
import { Button } from '@codesandbox/common/lib/components/Button';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';
import theme from '@codesandbox/common/lib/theme';

import { Heading, Container } from '../elements';
import { CheckBox, Fieldset, Label } from './elements';

// const Feedback = Loadable(() =>
//   import(/* webpackChunkName: 'feedback' */ './Feedback')
// );

const FeedbackModal = ({ store }) => {
  const { title, description } = store.workspace.project;
  const [selected, setSelected] = useState(false);
  const [starterTitle, setStaterTitle] = useState(title);
  const [starterDescription, setStaterDescription] = useState(description);

  const makeStarter = e => {
    e.preventDefault();
  };

  return (
    <Container>
      <Heading>Make Starter</Heading>
      <form onSubmit={makeStarter}>
        <Fieldset>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            required
            id="title"
            value={starterTitle}
            onChange={e => setStaterTitle(e.target.value)}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="description">Description</Label>
          <TextArea
            required
            name="description"
            id="description"
            value={starterDescription}
            onChange={e => setStaterDescription(e.target.value)}
          />
        </Fieldset>
        <Fieldset>
          <Label htmlFor="public">Make Public?</Label>
          <CheckBox
            selected
            id="public"
            onClick={() => setSelected(!selected)}
            color={selected ? theme.shySecondary : theme.background2}
          />
        </Fieldset>
        <Button
          css={`
            margin-top: 1rem;
          `}
          small
        >
          Make Starter
        </Button>
      </form>
    </Container>
  );
};

export default inject('store')(FeedbackModal);
