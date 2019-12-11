import React from 'react';

import { Highlight, Container } from './elements';

interface Props {
  brand: string;
  last4: string;
  name: string;
}

export function Card({ brand, last4, name }: Props) {
  return (
    <Container>
      <div>
        <Highlight>{brand}</Highlight> ending in ****
        <Highlight>{last4}</Highlight>
      </div>
      <div>
        <Highlight>{name}</Highlight>
      </div>
    </Container>
  );
}
