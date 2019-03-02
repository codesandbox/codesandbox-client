import React from 'react';

import Margin from 'common/lib/components/spacing/Margin';

import { Title, SubTitle } from './elements';

function ThankYou({ color, price }) {
  return (
    <Margin bottom={2}>
      <Title color={color}>Awesome!</Title>
      <SubTitle>
        Thank you <strong>so</strong> much for your support of ${price}!
      </SubTitle>
    </Margin>
  );
}

export default ThankYou;
