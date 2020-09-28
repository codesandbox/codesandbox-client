import React from 'react';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import { Title, SubTitle } from './elements';

interface ThankYouProps {
  color: string;
  price: number;
  markedAsCancelled: boolean;
}

export const ThankYou: React.FC<ThankYouProps> = ({
  color,
  price,
  markedAsCancelled,
}) => (
  <Margin bottom={2}>
    {!markedAsCancelled && <Title color={color}>Awesome!</Title>}
    <SubTitle>
      {markedAsCancelled
        ? 'Your subscription will be automatically cancelled before your next billing date.'
        : <span>Thank you <strong>so</strong> much for your support of {price}!</span>}
    </SubTitle>
  </Margin>
);
