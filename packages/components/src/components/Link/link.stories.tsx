import React from 'react';
import { Link } from '.';

export default {
  title: 'components/Link',
  component: Link,
};

export const Basic = () => (
  <Link href="https://codesandbox.stream">Plan old boring text</Link>
);

export const Muted = () => (
  <Link variant="muted" href="https://codesandbox.stream">
    muted link
  </Link>
);
