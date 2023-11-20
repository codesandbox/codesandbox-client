import React from 'react';
import {
  Collapsible,
  Text,
  Button,
  Stack,
  Link,
} from '@codesandbox/components';
import { useUpgradeFromV1ToV2 } from 'app/hooks/useUpgradeFromV1ToV2';

export const Docker = () => {
  const { perform, loading, canConvert } = useUpgradeFromV1ToV2('Docker menu');

  return (
    <Collapsible title="Docker" defaultOpen>
      <Stack direction="vertical" gap={6} padding={2}>
        <Text as="p" variant="muted" margin={0}>
          To run Docker, you need to upgrade your Sandbox into a Cloud Sandbox.
        </Text>
        <Text as="p" variant="muted" margin={0}>
          Devboxes are an improved coding experience that runs your code in the
          cloud. They allow you to run Docker, code in new languages, add
          servers, databases, and much more.
        </Text>
        <Text as="p" variant="muted" margin={0}>
          Do you want to convert this sandbox?
        </Text>
        <Stack align="center" gap={4}>
          <Button
            onClick={perform}
            loading={loading}
            variant="primary"
            autoWidth
          >
            Yes, {canConvert ? 'convert' : 'fork and convert'}
          </Button>
          <Link
            href="https://codesandbox.io/docs/tutorial/convert-browser-sandbox-cloud"
            target="_blank"
            rel="noreferrer noopener"
          >
            Learn more
          </Link>
        </Stack>
      </Stack>
    </Collapsible>
  );
};
