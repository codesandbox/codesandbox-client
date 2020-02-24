import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import React, { FormEvent, FunctionComponent, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { Explanation, Heading } from '../elements';
import { Container } from '../LiveSessionEnded/elements';

import { Field, Input, Label, TextArea } from './elements';

export const PickSandboxModal: FunctionComponent = () => {
  const {
    actions: {
      explore: { pickSandbox },
      modalClosed,
    },
    state: {
      explore: {
        pickedSandboxDetails: { id, ...details },
      },
    },
  } = useOvermind();
  const [description, setDescription] = useState(details.description);
  const [title, setTitle] = useState(details.title);

  return (
    <Container>
      <Heading>Pick this sandbox</Heading>

      <Explanation>
        Please add a title and description to this sandbox if none exists or you
        think you have a better description for it. This title and description
        will be the ones used in the explore page.
      </Explanation>

      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          pickSandbox({ description, id, title });
        }}
      >
        <Field>
          <Label htmlFor="title">Sandbox name</Label>

          <Input
            id="title"
            name="title"
            onChange={({ target: { value } }) => setTitle(value)}
            required
            value={title}
          />
        </Field>

        <Field>
          <Label htmlFor="description">Sandbox Description</Label>

          <TextArea
            id="description"
            name="description"
            onChange={({ target: { value } }) => setDescription(value)}
            required
            rows={3}
            value={description}
          />
        </Field>

        <Row justifyContent="space-around">
          <Button type="submit">
            Ship it{' '}
            <span role="img" aria-label="rocket">
              🚀
            </span>
          </Button>

          <Button danger onClick={() => modalClosed()}>
            Cancel
          </Button>
        </Row>
      </form>
    </Container>
  );
};
