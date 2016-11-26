// @flow
import React from 'react';
import styled from 'styled-components';

const Title = styled.h2`
  font-weight: bold;
  font-size: 14px;
`;

const Container = styled.div`
  position: fixed;
  font-family: 'Source Code Pro', monospace;
  background-color: rgb(204, 0, 0);
  color: white;

  padding: 10px;
  line-height: 1.2;
  text-align: left;
  font-size: 14px;
  white-space: nowrap;
  height: 300px;

  left: 0;
  right: 0;
  bottom: 0;
`;

export default ({ error }: { error: Error }) => {
  if (!error) return null;

  const [name, ...lines] = error.stack.split('\n').map(line => line.replace(/\s/g, '\u00a0'));
  return (
    <Container>
      <Title>{name}</Title>
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </Container>
  );
};
