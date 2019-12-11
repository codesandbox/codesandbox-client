import { Overlay as OverlayComponent } from 'app/components/Overlay';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { Arrow, Container, OrderName, OverlayContainer } from './elements';
import { Option } from './Option';

const FIELD_TO_NAME = {
  updatedAt: 'Last Modified',
  insertedAt: 'Last Created',
  title: 'Name',
};

interface Props {
  hideOrder: boolean;
}

export const SortOptions: React.FC<Props> = ({ hideOrder }) => {
  const { state, actions } = useOvermind();

  function toggleSort(e) {
    e.preventDefault();
    const { orderBy } = state.dashboard;
    const { orderByChanged } = actions.dashboard;
    orderByChanged({
      orderBy: {
        order: orderBy.order === 'asc' ? 'desc' : 'asc',
        field: orderBy.field,
      },
    });
  }

  function setField(field: string) {
    const { orderBy } = state.dashboard;
    const { orderByChanged } = actions.dashboard;
    orderByChanged({
      orderBy: {
        order: orderBy.order,
        field,
      },
    });
  }

  const { field, order } = state.dashboard.orderBy;

  const Overlay = () => (
    <OverlayContainer>
      <Option
        setField={setField}
        currentField={field}
        field="title"
        name={FIELD_TO_NAME.title}
      />
      <Option
        setField={setField}
        currentField={field}
        field="insertedAt"
        name={FIELD_TO_NAME.insertedAt}
      />
      <Option
        setField={setField}
        currentField={field}
        field="updatedAt"
        name={FIELD_TO_NAME.updatedAt}
      />
    </OverlayContainer>
  );

  return (
    <OverlayComponent event="Dashboard - Order By" content={Overlay}>
      {open => (
        <Container hideOrder={hideOrder}>
          Sort by <OrderName onClick={open}>{FIELD_TO_NAME[field]} </OrderName>
          <Arrow
            onClick={toggleSort}
            style={{
              transform: `rotate(${order === 'asc' ? -180 : 0}deg)`,
              fontSize: '.875rem',
              marginLeft: 4,
              marginBottom: 2,
            }}
          />
        </Container>
      )}
    </OverlayComponent>
  );
};
