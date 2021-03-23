/* eslint-disable jsx-a11y/accessible-emoji */
// @ts-nocheck
import React, { FormEvent, FunctionComponent, useState } from 'react';

import {
  FormField,
  Button,
  Text,
  Stack,
  Input,
  Textarea,
} from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import css from '@styled-system/css';
import { Alert } from '../Common/Alert';

export const PickSandboxModal: FunctionComponent = () => {
  const {
    explore: { pickSandbox },
    modalClosed,
  } = useActions();
  const {
    pickedSandboxDetails: { id, ...details },
  } = useAppState().explore;
  const [description, setDescription] = useState(details.description);
  const [title, setTitle] = useState(details.title);

  return (
    <Alert
      title="Pick this sandbox"
      description="Please add a title and description to this sandbox if none exists or you think you have a better description for it. This title and description will be the ones used in the explore page."
    >
      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          pickSandbox({ description, id, title });
        }}
      >
        <FormField
          style={{ padding: 0 }}
          marginBottom={4}
          direction="vertical"
          label="Sandbox name"
        >
          <Input
            marginTop={2}
            id="title"
            name="title"
            onChange={e => setTitle(e.target.value)}
            required
            value={title}
          />
        </FormField>

        <FormField
          style={{ padding: 0 }}
          marginBottom={4}
          direction="vertical"
          label="Sandbox Description"
        >
          <Textarea
            marginTop={2}
            id="description"
            name="description"
            onChange={e => setDescription(e.target.value)}
            required
            rows={3}
            value={description}
          />
        </FormField>

        <Stack justify="flex-end" gap={2}>
          <Button
            css={css({
              width: 'auto',
            })}
            variant="link"
            onClick={modalClosed}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            css={css({
              width: 'auto',
            })}
          >
            Ship it{' '}
            <Text as="span" paddingLeft={1} role="img" aria-label="rocket">
              🚀
            </Text>
          </Button>
        </Stack>
      </form>
    </Alert>
  );
};
