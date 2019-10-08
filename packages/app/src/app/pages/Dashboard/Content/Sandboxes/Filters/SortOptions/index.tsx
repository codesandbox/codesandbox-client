import React from 'react';
import { useOvermind } from 'app/overmind';
import { useMenuState, Menu, MenuItem, MenuDisclosure } from 'reakit/Menu';
import { Option } from './Option';
import { Container, Arrow, OrderName, OverlayContainer } from './elements';

const FIELD_TO_NAME = {
  updatedAt: 'Last Modified',
  insertedAt: 'Last Created',
  title: 'Name',
};

export const SortOptions: React.FC<{ hideOrder: boolean }> = ({
  hideOrder,
}) => {
  const {
    state: {
      dashboard: {
        orderBy: { field, order },
      },
    },
    actions: {
      dashboard: { orderByChanged },
    },
  } = useOvermind();
  const menu = useMenuState({
    gutter: 10,
  });

  const toggleSort = e => {
    e.preventDefault();

    orderByChanged({
      orderBy: {
        order: order === 'asc' ? 'desc' : 'asc',
        field,
      },
    });
  };

  const setField = (fieldToSet: string) => {
    orderByChanged({
      orderBy: {
        order,
        field: fieldToSet,
      },
    });
  };

  return (
    <>
      <MenuDisclosure {...menu}>
        {buttonProps => (
          <Container hideOrder={hideOrder}>
            <span aria-hidden>Sort by </span>
            <OrderName
              aria-label={`Select short sandboxes by, current ${
                FIELD_TO_NAME[field]
              } `}
              {...buttonProps}
            >
              {FIELD_TO_NAME[field]}{' '}
            </OrderName>
            <Arrow
              aria-label={`toggle ${order === 'asc' ? 'desc' : 'asc'} short`}
              onClick={toggleSort}
              style={{
                transform: `rotate(${order === 'asc' ? -180 : 0}deg)`,
                fontSize: '.875rem',
                marginLeft: 4,
              }}
            />
          </Container>
        )}
      </MenuDisclosure>
      <Menu unstable_portal {...menu} aria-label="Dashboard - Order By">
        <OverlayContainer as="ul">
          <MenuItem
            as={Option}
            {...menu}
            setField={setField}
            currentField={field}
            field="title"
            name={FIELD_TO_NAME.title}
          />
          <MenuItem
            as={Option}
            {...menu}
            setField={setField}
            currentField={field}
            field="insertedAt"
            name={FIELD_TO_NAME.insertedAt}
          />
          <MenuItem
            as={Option}
            {...menu}
            setField={setField}
            currentField={field}
            field="updatedAt"
            name={FIELD_TO_NAME.updatedAt}
          />
        </OverlayContainer>
      </Menu>
    </>
  );
};
