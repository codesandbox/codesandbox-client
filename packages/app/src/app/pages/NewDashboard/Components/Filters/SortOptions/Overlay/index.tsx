import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import { FIELD_TO_NAME } from '../FieldToName';
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
    <Element>
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
    </Element>
  );
};
