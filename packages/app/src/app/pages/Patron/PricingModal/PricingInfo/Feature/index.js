import React from 'react';

import { Container, Feature, Value } from './elements';

function FeatureComponent({ disabled, feature, free, supporter }) {
  return (
    <Container disabled={disabled}>
      <Feature>{feature}</Feature>
      <Value>{free}</Value>
      <Value supporter>{supporter}</Value>
    </Container>
  );
}

export default FeatureComponent;
