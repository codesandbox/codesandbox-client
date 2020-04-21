import React, { FunctionComponent } from 'react';
import ArrowDown from 'react-icons/lib/md/arrow-downward';
import ArrowUp from 'react-icons/lib/md/arrow-upward';
import { Overlay as OverlayComponent } from 'app/components/Overlay';
import { useOvermind } from 'app/overmind';
import { Element, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { FIELD_TO_NAME } from './FieldToName';
import { Overlay } from './Overlay';

export const SortOptions: FunctionComponent = () => {
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

  const toggleSort = event => {
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
        <Element>
          Sort by <Element onClick={open}>{FIELD_TO_NAME[field]}</Element>
          <Button
            variant="link"
            css={css({
              width: 'auto',
            })}
            onClick={toggleSort}
          >
            {order === 'desc' ? <ArrowDown /> : <ArrowUp />}
          </Button>
        </Element>
      )}
    </OverlayComponent>
  );
};
