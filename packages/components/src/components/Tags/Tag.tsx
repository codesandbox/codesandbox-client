import React from 'react';

import { Container, DeleteIcon } from './elements';

export type Props = {
  tag: string;
  removeTag?: ({ tag }: { tag: string }) => void;
};

export default function Tag({ tag, removeTag }: Props) {
  return (
    <Container canRemove={Boolean(removeTag)}>
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
