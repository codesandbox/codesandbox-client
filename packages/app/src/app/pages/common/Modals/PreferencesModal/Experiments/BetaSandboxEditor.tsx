import {
  Checkbox,
  Element,
  Text,
  Button,
  Stack,
} from '@codesandbox/components';
import React, { useState } from 'react';

import { useBetaSandboxEditor } from 'app/hooks/useBetaSandboxEditor';
import { useAppState, useEffects } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { Textarea } from 'app/components/dashboard/Textarea';
import { PaddedPreference } from '../elements';

const FEEDBACK_OPTIONS_LABEL = {
  buggyExperience: 'The experience is too buggy',
  missingLiveRoom: 'Missing live room / classroom feature',
  slowness: 'The editor feels slow',
  navigability: 'I found the editor hard to navigate',
  other: 'Something else',
};

const ROWS_REQUEST_URL =
  'https://api.rows.com/v1beta1/spreadsheets/JFBFxxAPvXEYDY7cU9GCA/tables/15558697-182d-43f7-a1f2-6c293a557295/values/A:G:append';

// @ts-ignore
const ROWS_API_KEY = '1WcvujvzSSQ1GtbnoYvrGb8liPJFWud915ELpjwnVfV5';

export const BetaSandboxEditor = () => {
  const { user } = useAppState();
  const effects = useEffects();

  const [betaSandboxEditor, setBetaSandboxEditor] = useBetaSandboxEditor();

  const [feedbackMode, setFeedbackMode] = useState(false);
  const [feedbackOptions, setFeedbackOptions] = useState({
    buggyExperience: false,
    missingLiveRoom: false,
    slowness: false,
    navigability: false,
    other: false,
    feedback: null,
  });

  const atLeastOneFeedbackOptionSelected = Object.values(feedbackOptions).some(
    value => value
  );

  const isInProd = window.location.host === 'codesandbox.io';

  return (
    <Element>
      <PaddedPreference
        setValue={() => {
          if (!betaSandboxEditor) {
            track('Enable new sandbox editor - User preferences');
          } else {
            track('Disable new sandbox editor - User preferences');
            setFeedbackMode(true);
          }

          setBetaSandboxEditor(!betaSandboxEditor);
        }}
        title="Sandbox beta editor"
        tooltip="Use beta editor"
        type="boolean"
        value={betaSandboxEditor}
      />

      <Text block marginTop={2} size={3} variant="muted">
        Run your sandboxes in a faster and more stable editor.
      </Text>

      {feedbackMode && (
        <Element
          as="form"
          onSubmit={ev => {
            ev.preventDefault();
            if (isInProd && ROWS_API_KEY) {
              effects.http.post(
                ROWS_REQUEST_URL,
                {
                  values: [[user?.id, ...Object.values(feedbackOptions)]],
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
            setFeedbackOptions({
              buggyExperience: false,
              missingLiveRoom: false,
              slowness: false,
              navigability: false,
              other: false,
              feedback: null,
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
              Would you mind telling us what you dislike about the new editor?
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

            {feedbackOptions.other === true && (
              <Textarea
                id="feedback"
                name="feedback"
                css={{ fontSize: '13px' }}
                placeholder="Something seems wrong..."
                value={feedbackOptions.feedback}
                onChange={ev =>
                  setFeedbackOptions({
                    ...feedbackOptions,
                    feedback: ev.target.value,
                  })
                }
              />
            )}

            <Button
              autoWidth
              variant="primary"
              disabled={!atLeastOneFeedbackOptionSelected}
              type="submit"
            >
              Send feedback
            </Button>
          </Stack>
        </Element>
      )}
    </Element>
  );
};
