import React from 'react';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import { Title, SubTitle } from './elements';

export const ThankYou = ({ color, price, markedAsCancelled }) => (
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
