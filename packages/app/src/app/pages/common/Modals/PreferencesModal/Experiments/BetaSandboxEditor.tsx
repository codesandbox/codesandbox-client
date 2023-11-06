import {
  Checkbox,
  Element,
  Text,
  Button,
  Stack,
} from '@codesandbox/components';
import React, { useState } from 'react';

import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { useAppState, useEffects } from 'app/overmind';
import { PaddedPreference } from '../elements';

const FEEDBACK_OPTIONS_LABEL = {
  buggyExperience: 'The experience is too buggy',
  missingLiveRoom: 'Missing live room / classroom feature',
  slowness: 'The editor feels slow',
  navigability: 'I found the editor hard to navigate',
  other: 'Something else',
};

const ROWS_REQUEST_URL =
  'https://api.rows.com/v1beta1/spreadsheets/JFBFxxAPvXEYDY7cU9GCA/tables/15558697-182d-43f7-a1f2-6c293a557295/values/A:F:append';
const ROWS_API_KEY = '1WcvujvzSSQ1GtbnoYvrGb8liPJFWud915ELpjwnVfV5';

export const BetaSandboxEditor = () => {
  const { user } = useAppState();
  const effects = useEffects();

  const [betaSandboxEditor, setBetaSandboxEditor] = useGlobalPersistedState(
    'BETA_SANDBOX_EDITOR',
    false
  );

  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackOptions, setFeedbackOptions] = useState({
    buggyExperience: false,
    missingLiveRoom: false,
    slowness: false,
    navigability: false,
    other: false,
  });

  const atLeastOneFeedbackOptionSelected = Object.values(feedbackOptions).some(
    value => value
  );

  const isInProd = window.location.host === 'codesandbox.io';

  return (
    <>
      <PaddedPreference
        setValue={() => {
          if (betaSandboxEditor) {
            setFeedbackMode(true);
          } else {
            setBetaSandboxEditor(true);
          }
        }}
        title="Sandbox beta editor"
        tooltip="Use beta editor"
        type={feedbackMode ? 'none' : 'boolean'}
        value={betaSandboxEditor}
      />

      <Text block marginTop={2} size={3} variant="muted">
        Run your sandboxes in a faster, more stable, and collaborative by
        default editor.
      </Text>

      {feedbackMode && (
        <Element
          as="form"
          onSubmit={ev => {
            ev.preventDefault();
            if (isInProd) {
              effects.http.post(
                ROWS_REQUEST_URL,
                {
                  values: [[user.id, ...Object.values(feedbackOptions)]],
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + ROWS_API_KEY,
                  },
                }
              );
            }

            setFeedbackMode(false);
            setBetaSandboxEditor(false);
            setFeedbackOptions({
              buggyExperience: false,
              missingLiveRoom: false,
              slowness: false,
              navigability: false,
              other: false,
            });
          }}
          paddingTop={4}
        >
          <Stack
            css={{
              borderTop: '1px solid #343434',
              paddingTop: '16px !important',
            }}
            direction="vertical"
            gap={3}
          >
            <Text block size={3}>
              Before we disable this experiment, we would like to understand the
              reasons for your dislike:
            </Text>
            {Object.keys(FEEDBACK_OPTIONS_LABEL).map(key => (
              <Checkbox
                key={key}
                checked={feedbackOptions[key]}
                onChange={ev => {
                  setFeedbackOptions({
                    ...feedbackOptions,
                    [key]: ev.target.checked,
                  });
                }}
                label={
                  <Text size={3} variant="muted">
                    {FEEDBACK_OPTIONS_LABEL[key]}
                  </Text>
                }
              />
            ))}

            <Button
              autoWidth
              variant="primary"
              disabled={!atLeastOneFeedbackOptionSelected}
              type="submit"
            >
              Disable
            </Button>
          </Stack>
        </Element>
      )}
    </>
  );
};
