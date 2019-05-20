import React from 'react';

import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import { Title, SubTitle } from './elements';

function ThankYou({ color, price, markedAsCancelled }) {
  return (
    <Margin bottom={2}>
      {!markedAsCancelled && <Title color={color}>Awesome!</Title>}
      <SubTitle>
        {markedAsCancelled ? (
          'Your subscription will be automatically cancelled before your next billing date.'
        ) : (
          <React.Fragment>
            Thank you <strong>so</strong> much for your support of ${price}!
          </React.Fragment>
        )}
      </SubTitle>
    </Margin>
  );
}

export default ThankYou;
