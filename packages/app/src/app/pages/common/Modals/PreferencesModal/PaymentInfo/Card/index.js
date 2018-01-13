import React from 'react';

import { Highlight, Container } from './elements';

function Card({ brand, last4, name }) {
  return (
    <Container>
      <div>
        <Highlight>{brand}</Highlight> ending in ****<Highlight>
          {last4}
        </Highlight>
      </div>
      <div>
        <Highlight>{name}</Highlight>
      </div>
    </Container>
  );
}

export default Card;
