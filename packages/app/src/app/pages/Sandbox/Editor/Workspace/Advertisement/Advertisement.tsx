import React from 'react';

import { useScript } from 'app/hooks';

import { Container } from './elements';

export const Advertisement = () => {
  useScript(`https://codefund.app/properties/24/funder.js`);

  return (
    <Container>
      <div id="codefund" />
    </Container>
  );
};
