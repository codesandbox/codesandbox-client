import React from 'react';

import Button from '../Button';
import { Container, Title, Text, Buttons } from './elements';

function Alert({ title, body, onCancel, onDelete }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Text>{body}</Text>
      <Buttons>
        <Button small block secondary onClick={onCancel}>
          Cancel
        </Button>
        <Button small block primary onClick={onDelete}>
          Delete
        </Button>
      </Buttons>
    </Container>
  );
}

export default Alert;
