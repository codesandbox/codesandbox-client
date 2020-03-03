import React, {
  ComponentProps,
  FunctionComponent,
  MouseEvent,
  ReactSVGElement,
} from 'react';

import { Overlay as OverlayComponent } from 'app/components/Overlay';
import { useOvermind } from 'app/overmind';

import { Arrow, Container, OrderName } from './elements';
import { FIELD_TO_NAME } from './FieldToName';
import { Overlay } from './Overlay';

type Props = Pick<ComponentProps<typeof Container>, 'hideOrder'>;
export const SortOptions: FunctionComponent<Props> = ({ hideOrder }) => {
  const {
    actions: {
      dashboard: { orderByChanged },
    },
    state: {
      dashboard: {
        orderBy: { field, order },
      },
    },
  } = useOvermind();

  const toggleSort = (event: MouseEvent<ReactSVGElement>) => {
    event.preventDefault();

    orderByChanged({
      field,
      order: order === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <OverlayComponent
      width={200}
      content={Overlay}
      event="Dashboard - Order By"
    >
      {open => (
        <Container hideOrder={hideOrder}>
          Sort by <OrderName onClick={open}>{FIELD_TO_NAME[field]} </OrderName>
          <Arrow onClick={toggleSort} order={order} />
        </Container>
      )}
    </OverlayComponent>
  );
};
