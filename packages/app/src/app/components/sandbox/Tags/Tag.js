import React from 'react';
import styled, { css } from 'styled-components';

import { Container, DeleteIcon } from './elements';

export default function Tag({ tag, removeTag }) {
  return (
    <Container canRemove={removeTag}>
      {tag}
      {removeTag && (
        <DeleteIcon
          onClick={() => {
            removeTag({ tag });
          }}
        />
      )}
    </Container>
  );
}
