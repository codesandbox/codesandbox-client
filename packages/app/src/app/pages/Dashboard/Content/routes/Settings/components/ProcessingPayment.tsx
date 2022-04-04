import React, { useEffect, useState } from 'react';
import css from '@styled-system/css';
import { Stack, Text, Link, Icon } from '@codesandbox/components';
import { useActions, useEffects } from 'app/overmind';
import { Card } from '.';

const MAX_TRIES = 20;

export const ProcessingPayment = () => {
  const { getActiveTeamInfo } = useActions();
  const [counter, setCounter] = useState(-1);
  const { notificationToast } = useEffects();

  useEffect(() => {
    let timer;

    if (counter < MAX_TRIES) {
      timer = setInterval(() => {
        getActiveTeamInfo();
        setCounter(prev => prev + 1);
      }, 1000);
    } else {
      notificationToast.error(
        'Something went wrong, please try again later or email us at support@codesandbox.io'
      );
    }

    return () => clearInterval(timer);
  }, [counter, getActiveTeamInfo, notificationToast]);

  return (
    <Card>
      <Stack direction="vertical" gap={2}>
        <Text size={6} weight="bold" maxWidth="100%">
          Processing...
        </Text>

        <Text size={3} variant="muted">
          Your payment is being processed and as soon as it&apos;s approved,
          your subscription will be activated.
        </Text>

        <Stack direction="vertical" gap={2} marginTop={4}>
          <Link
            size={3}
            variant="active"
            css={css({ fontWeight: 'medium' })}
            onClick={() => window.location.reload()}
          >
            <Stack align="center">
              <Icon name="reload" style={{ marginRight: '.5em' }} />
              Refresh page
            </Stack>
          </Link>
        </Stack>
      </Stack>
    </Card>
  );
};
