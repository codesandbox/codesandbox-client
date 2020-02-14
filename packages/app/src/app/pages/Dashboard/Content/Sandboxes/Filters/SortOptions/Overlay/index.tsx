import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { FIELD_TO_NAME } from '../FieldToName';

import { Container } from './elements';
import { Option } from './Option';

export const Overlay: FunctionComponent = () => {
  const {
    actions: {
      dashboard: { orderByChanged },
    },
    state: {
      dashboard: {
        orderBy: { field: currentField, order },
      },
    },
  } = useOvermind();

  const setField = (field: string) => orderByChanged({ field, order });

  return (
    <Container>
      <Option
        currentField={currentField}
        field="title"
        name={FIELD_TO_NAME.title}
        setField={setField}
      />

      <Option
        currentField={currentField}
        field="insertedAt"
        name={FIELD_TO_NAME.insertedAt}
        setField={setField}
      />

      <Option
        currentField={currentField}
        field="updatedAt"
        name={FIELD_TO_NAME.updatedAt}
        setField={setField}
      />
    </Container>
  );
};
