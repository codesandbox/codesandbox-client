import React from 'react';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import { Title, SubTitle } from './elements';

interface Props {
  color: string;
  price: number;
  markedAsCancelled: boolean;
}

export const ThankYou = ({ color, price, markedAsCancelled }: Props) => (
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
