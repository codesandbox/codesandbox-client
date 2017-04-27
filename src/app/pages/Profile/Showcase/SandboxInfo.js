import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-weight: 300;
  margin-top: 0;
`;

const Description = styled.p`
  font-weight: 300;
  margin-top: 0;
  font-size: 1rem;
`;

type Props = {
  title: string,
};

export default ({ title }: Props) => (
  <div>
    <Title>{title}</Title>
    <Description>
      An example of React Router copied from https://reacttraining.com/react-router/web/guides/quick-start.
    </Description>
  </div>
);
