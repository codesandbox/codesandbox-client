import React from 'react';

import { Container, Feature as FeatureElement, Value } from './elements';

type FeatureComponentProps = {
  disabled?: boolean;
  feature: string;
  free: string;
  supporter: string;
};

export const Feature: React.FC<FeatureComponentProps> = ({
  disabled,
  feature,
  free,
  supporter,
}) => (
  <Container disabled={disabled}>
    <FeatureElement>{feature}</FeatureElement>
    <Value>{free}</Value>
    <Value supporter>{supporter}</Value>
  </Container>
);
