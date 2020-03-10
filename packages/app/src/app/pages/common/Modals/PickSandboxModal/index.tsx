/* eslint-disable jsx-a11y/accessible-emoji */
// @ts-nocheck
import React, { FormEvent, FunctionComponent, useState } from 'react';

import {
  Element,
  FormField,
  Button,
  Text,
  Stack,
  Input,
  Textarea,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';

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
    <Element padding={4} paddingTop={6}>
      <Text weight="bold" block size={4} paddingBottom={2}>
        Pick this sandbox
      </Text>
      <Text marginBottom={6} size={3} block>
        Please add a title and description to this sandbox if none exists or you
        think you have a better description for it. This title and description
        will be the ones used in the explore page.
      </Text>

      <form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          pickSandbox({ description, id, title });
        }}
      >
        <FormField marginBottom={4} direction="vertical" label="Sandbox name">
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

          <Button
            css={css({
              width: 'auto',
            })}
            variant="link"
            onClick={() => modalClosed()}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </Element>
  );
};
