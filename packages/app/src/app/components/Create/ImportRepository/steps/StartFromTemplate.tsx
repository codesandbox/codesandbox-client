import React, { useState } from 'react';
import { Button, Stack, Text, Textarea } from '@codesandbox/components';
import { useAppState, useEffects } from 'app/overmind';
import { InputExplanation } from '../components/InputExplanation';

const ROWS_REQUEST_URL =
  'https://api.rows.com/v1/spreadsheets/LCBJXPdwTRrAFndAgQHU5/tables/73eb166b-8a27-4b7a-87ad-a944103dcdf0/values/A:B:append';

const ROWS_API_KEY = '1WcvujvzSSQ1GtbnoYvrGb8liPJFWud915ELpjwnVfV5';

export const StartFromTemplate = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const effects = useEffects();
  const { user } = useAppState();

  return (
    <Stack
      as="form"
      onSubmit={async ev => {
        ev.preventDefault();
        if (formSubmitted) {
          return;
        }

        await effects.http.post(
          ROWS_REQUEST_URL,
          {
            values: [[user?.id, userInput]],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + ROWS_API_KEY,
            },
          }
        );

        setUserInput('');
        setFormSubmitted(true);
      }}
      direction="vertical"
      gap={4}
    >
      <Text>Coming soon</Text>
      <Stack direction="vertical" gap={2}>
        <InputExplanation variant="info">
          We are preparing a list of project starters on this page.
        </InputExplanation>
        <Text size={3}>
          Meanwhile, tell us which starters you would like to see here.
        </Text>

        <Textarea
          autoFocus
          id="feedback"
          name="feedback"
          css={{ fontSize: '13px' }}
          onChange={e => setUserInput(e.target.value)}
          placeholder="I would like..."
        />

        {formSubmitted ? (
          <Text>Thank you for your input!</Text>
        ) : (
          <Button type="submit" autoWidth>
            Submit
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
