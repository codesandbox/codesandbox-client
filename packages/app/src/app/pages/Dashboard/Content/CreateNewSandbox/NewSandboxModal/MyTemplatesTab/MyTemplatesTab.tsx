import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import Template from '@codesandbox/common/lib/components/Template';
import { LIST_TEMPLATES } from '../../../../queries';
import { Templates } from '../elements';
import { Empty, Title } from './elements';

export const MyTemplatesTab = ({ selectTemplate }) => {
  const { data } = useQuery(LIST_TEMPLATES);

  return data && data.me && data.me.templates.length ? (
    <Templates>
      {data.me.templates.map(template => (
        <Template
          key={template.id}
          template={template}
          selectTemplate={selectTemplate}
          small={false}
        />
      ))}
    </Templates>
  ) : (
    <Empty>
      <Title>You haven’t created any templates yet</Title>
    </Empty>
  );
};
