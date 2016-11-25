import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;

  margin-top: -8px;
  margin-left: -8px;
  margin-right: -8px;

  background-color: #F5F5F5;
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
  border: 1px solid #ccc;
  padding: 2px;
  padding-left: 25px;
  color: rgb(153, 153, 153);
`;

export default () => (
  <Container>
    <InputContainer>
      <Input value="/" />
    </InputContainer>
  </Container>
);
