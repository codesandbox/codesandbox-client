import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import Template from '@codesandbox/common/lib/components/Template';
import { LIST_TEMPLATES } from '../../../../../queries';

import { Templates } from '../../elements';

const Title = styled.h3`
  font-family: 'Poppins', 'Roboto', sans-serif;
  font-weight: 600;
  width: 60%;
  font-size: 24px;
  line-height: 36px;

  color: ${props => props.theme.white};
`;

const Empty = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export default ({ selectTemplate }) => {
  const { data } = useQuery(LIST_TEMPLATES);
  return data.me && data.me.templates.length ? (
    <Templates>
      {data.me.templates.map(template => (
        <Template
          key={template.id}
          template={template}
          selectTemplate={selectTemplate}
        />
      ))}
    </Templates>
  ) : (
    <Empty>
      <Title>You haven’t created any templates yet</Title>
    </Empty>
  );
};
