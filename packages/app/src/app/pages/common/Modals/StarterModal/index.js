import React, { useState } from 'react';

import { inject } from 'mobx-react';
import { Button } from '@codesandbox/common/lib/components/Button';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';

import { Heading, Container, Explanation } from '../elements';
import { CheckBox, Fieldset, Label } from './elements';

const StarterModal = ({ store, signals }) => {
  const { title, description } = store.workspace.project;
  const [selected, setSelected] = useState(false);
  const [starterTitle, setStaterTitle] = useState(title);
  const [starterDescription, setStaterDescription] = useState(description);

  const makeStarter = e => {
    e.preventDefault();
    signals.editor.frozenUpdated({
      frozen: true,
    });
    signals.modalOpened({ modal: null });
  };

  return (
    <Container>
      <Heading>Make Starter</Heading>
      <Explanation>
        By making your sandbox a starter you will be able to see it in your
        create sandbox modal and start with this sandbox quickly.
        <br />
        If you decide to make it public it can be used by anyone in the
        CodeSandbox community.
      </Explanation>
      <form onSubmit={makeStarter}>
        <Fieldset>
          <Label htmlFor="title">Title</Label>
          <Input
            block
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
            block
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
            type="checkbox"
            checked={selected}
            id="public"
            onChange={() => setSelected(!selected)}
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

export default inject('store', 'signals')(StarterModal);
