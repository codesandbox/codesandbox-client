import * as React from 'react';

import { Highlight, Container } from './elements';

export type Props = {
  brand: string
  last4: string
  name: string
}

const Card: React.SFC<Props> = ({ brand, last4, name }) => {
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
