import React from 'react';
import styled from 'styled-components';

const Highlight = styled.strong`color: rgba(255, 255, 255, 0.8);`;

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  line-height: 1.25;
  border-radius: 2px;
`;

type Props = {
  brand: string,
  last4: string,
  name: string,
};

export default ({ brand, last4, name }: Props) => (
  <Container>
    <div>
      <Highlight>{brand}</Highlight> ending in ****<Highlight>{last4}</Highlight>
    </div>
    <div>
      <Highlight>{name}</Highlight>
    </div>
  </Container>
);
