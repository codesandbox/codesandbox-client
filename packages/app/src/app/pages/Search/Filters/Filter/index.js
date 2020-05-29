import React, { useCallback, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { RefinementList } from 'react-instantsearch/dom';

import { Button, Container, Title } from './elements';

const Filter = ({
  attributeName,
  noSearch,
  operator,
  title,
  transformItems,
}) => {
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

      <RefinementList
        transformItems={transformItems}
        searchable={!noSearch}
        showMore={!noSearch}
        operator={operator}
        attribute={attributeName}
      />
    </Container>
  );
};

export default Filter;
