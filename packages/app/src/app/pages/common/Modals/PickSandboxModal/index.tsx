import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';

import { Button } from '@codesandbox/common/lib/components/Button';
import Row from '@codesandbox/common/lib/components/flex/Row';
import Input, { TextArea } from '@codesandbox/common/lib/components/Input';

import { Container } from '../LiveSessionEnded/elements';
import { Heading, Explanation } from '../elements';

import { Field, Label } from './elements';

export const StorageManagementModal: React.FC = () => {
  const {
    state: {
      explore: {
        pickedSandboxDetails
      }
    },
    actions: {
      modalClosed,
      explore: {
        pickSandbox
      }
    }
  } = useOvermind();


  const [title, setTitle] = useState(pickedSandboxDetails.title || '');
  const [description, setDescription] = useState(pickedSandboxDetails.description || '');
  const { id } = pickedSandboxDetails;

  return (
    <Container>
      <Heading>Pick this sandbox</Heading>
      <Explanation>
        Please add a title and description to this sandbox if none exists or
        you think you have a better description for it. This title and
        description will be the ones used in the explore page.
      </Explanation>
      <form
        onSubmit={e => {
          e.preventDefault();
          pickSandbox({
            id,
            title,
            description,
          });
        }}
      >
        <Field>
          <Label htmlFor="title">Sandbox name</Label>
          <Input
            style={{
              width: '100%',
            }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            name="title"
            id="title"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="description">Sandbox Description</Label>
          <TextArea
            style={{
              width: '100%',
            }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            name="description"
            id="description"
            required
            rows={3}
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
}
