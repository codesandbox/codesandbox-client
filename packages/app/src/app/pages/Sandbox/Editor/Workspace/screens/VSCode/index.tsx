import React from 'react';
import {
  Collapsible,
  Text,
  Button,
  Stack,
  Link,
} from '@codesandbox/components';
import { useUpgradeFromV1ToV2 } from 'app/hooks/useUpgradeFromV1ToV2';

export const VSCode = () => {
  const { perform, loading } = useUpgradeFromV1ToV2('VSCode menu', true);

  return (
    <Collapsible title="VS Code" defaultOpen>
      <Stack direction="vertical" gap={6} padding={2}>
        <Text as="p" variant="muted" margin={0}>
          To use VS Code together with CodeSandbox, you need to convert your
          Browser Sandbox into a Cloud Sandbox.
        </Text>
        <Text as="p" variant="muted" margin={0}>
          Cloud Sandboxes are an improved coding experience that runs your code
          in the cloud. They allow you to run Docker, code in new languages, add
          servers, databases, and much more.
        </Text>
        <Text as="p" variant="muted" margin={0}>
          Don&apos;t worry&mdash;this sandbox will not be deleted. After
          converting, you will have both versions.
        </Text>
        <Text as="p" variant="muted" margin={0}>
          Do you want to fork this sandbox?
        </Text>
        <Stack align="center" gap={4}>
          <Button
            onClick={perform}
            loading={loading}
            variant="primary"
            autoWidth
          >
            Yes, fork
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
