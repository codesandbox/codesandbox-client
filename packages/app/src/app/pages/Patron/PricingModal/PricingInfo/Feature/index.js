import React from 'react';

import { Container, Feature, Value } from './elements';

const FeatureComponent = ({ disabled, feature, free, supporter }) => (
  <Container disabled={disabled}>
    <Feature>{feature}</Feature>

    <Value>{free}</Value>

    <Value supporter>{supporter}</Value>
  </Container>
);

export default FeatureComponent;
