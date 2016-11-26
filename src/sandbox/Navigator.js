import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  background-color: ${props => props.theme.background};
  border-bottom: 1px solid #ccc;
  padding: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  line-height: 1.5;
  font-size: 16px;
`;

const Input = styled.input`
  flex: 1;
  font-size: inherit;
  line-height: inherit;
  border: none;
  padding: 2px;
  padding-left: 25px;
  color: rgb(153, 153, 153);
  background-color: ${props => props.theme.background.lighten(0.5)}
`;

export default () => (
  <Container>
    <InputContainer>
      <Input value="/" />
    </InputContainer>
  </Container>
);
