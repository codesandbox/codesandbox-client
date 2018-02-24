import * as React from 'react';

import { Container, Feature, Value } from './elements';

type Props = {
  disabled?: boolean
  feature?: string
  free?: string
  supporter?: string
}

function FeatureComponent({ disabled, feature, free, supporter }: Props) {
  return (
    <Container disabled={disabled}>
      <Feature>{feature}</Feature>
      <Value>{free}</Value>
      <Value supporter>{supporter}</Value>
    </Container>
  );
}

export default FeatureComponent;
