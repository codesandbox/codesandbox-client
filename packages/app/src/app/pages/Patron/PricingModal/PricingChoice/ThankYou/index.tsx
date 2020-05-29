import Margin from '@codesandbox/common/es/components/spacing/Margin';
import React from 'react';

import { SubTitle, Title } from './elements';

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
      {markedAsCancelled ? (
        'Your subscription will be automatically cancelled before your next billing date.'
      ) : (
        <>
          Thank you <strong>so</strong> much for your support of ${price}!
        </>
      )}
    </SubTitle>
  </Margin>
);
