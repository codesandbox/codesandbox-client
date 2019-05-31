import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Template from '@codesandbox/common/lib/components/Template';
import { LIST_TEMPLATES } from '../../../../queries';

import { Templates } from '../elements';

export default ({ selectTemplate }) => {
  const { data } = useQuery(LIST_TEMPLATES);
  return data.me ? (
    <Templates>
      {data.me.templates.map(template => (
        <Template
          key={template.id}
          template={template}
          selectTemplate={selectTemplate}
        />
      ))}
    </Templates>
  ) : null;
};
