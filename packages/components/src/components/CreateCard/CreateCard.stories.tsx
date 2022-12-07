import React from 'react';
import styled from 'styled-components';
import { CreateCard } from './CreateCard';

export default {
  title: 'components/facelift/CreateCard',
  component: CreateCard,
};

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  height: 154px;
`;

export const SimpleVariant = () => (
  <CardWrapper>
    <CreateCard icon="github" label="Import from GitHub" />
  </CardWrapper>
);

export const LongLabelVariant = () => (
  <CardWrapper>
    <CreateCard
      icon="plus"
      label="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut fringilla, est tempor pellentesque dapibus, ligula dolor egestas ante, tempor pharetra."
    />
  </CardWrapper>
);
