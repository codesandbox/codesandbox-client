import React, { useCallback, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { SortBy } from 'react-instantsearch-dom';

import { Button, Container, Title } from './elements';

const Sort = ({ defaultRefinement, items, title }) => {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen(isOpen => !isOpen);
  }, []);

  return (
    <Container open={open}>
      <Title>
        <span>{title}</span>

        <Button onClick={toggle}>
          {open ? <MdExpandLess /> : <MdExpandMore />}
        </Button>
      </Title>

      <SortBy defaultRefinement={defaultRefinement} items={items} />
    </Container>
  );
};

export default Sort;
