import React from 'react';
import styled from 'styled-components';

import Margin from 'common/components/spacing/Margin';
import delay from 'common/utils/animation/delay-effect';

const Title = styled.div`
  ${delay(0)} transition: 0.3s ease all;
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  color: ${props => props.color};
`;

const SubTitle = styled.div`
  ${delay(0.1)} font-size: 1.25rem;
  font-weight: 300;
  margin: 1rem;
  margin-bottom: 0rem;
  text-align: center;
`;

export default ({ color, price }: { color: string, price: number }) => (
  <Margin bottom={2}>
    <Title color={color}>Awesome!</Title>
    <SubTitle>
      Thank you <strong>so</strong> much for your support of ${price}!
    </SubTitle>
  </Margin>
);
