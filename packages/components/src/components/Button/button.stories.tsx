import React from 'react';
import { Button } from '.';
import { Stack } from '../Stack';

export default {
  title: 'components/Button',
  component: Button,
};

// replace the text inside with Text variants when available
export const Basic = () => <Button>Create Sandbox, it’s free</Button>;

export const Variants = () => (
  <Stack direction="vertical" gap={4} style={{ width: 200 }}>
    <Button variant="primary">primary by default</Button>
    <Button variant="secondary">Save as Template</Button>
    <Button variant="link">Open sandbox</Button>
    <Button variant="danger">Go live</Button>
    <Button variant="light">Light variant</Button>
    <Button variant="dark">Dark variant</Button>
    <Button variant="trial">Trial variant</Button>
  </Stack>
);

export const Disabled = () => (
  <Stack direction="vertical" gap={4} style={{ width: 200 }}>
    <Button disabled variant="primary">
      primary by default
    </Button>
    <Button disabled variant="secondary">
      Save as Template
    </Button>
    <Button disabled variant="link">
      Open sandbox
    </Button>
    <Button disabled variant="danger">
      Go live
    </Button>
    <Button disabled variant="light">
      Light variant
    </Button>
    <Button disabled variant="dark">
      Dark variant
    </Button>
    <Button disabled variant="trial">
      Trial variant
    </Button>
  </Stack>
);

export const Loading = () => (
  <Stack direction="vertical" gap={4} style={{ width: 200 }}>
    <Button loading variant="primary">
      primary by default
    </Button>
    <Button loading variant="secondary">
      Save as Template
    </Button>
    <Button loading variant="link">
      Open sandbox
    </Button>
    <Button loading variant="danger">
      Go live
    </Button>
    <Button loading variant="light">
      Light variant
    </Button>
    <Button loading variant="dark">
      Dark variant
    </Button>
    <Button loading variant="trial">
      Trial variant
    </Button>
  </Stack>
);
