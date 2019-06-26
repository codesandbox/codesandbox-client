import React from 'react';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import history from 'app/utils/history';
import { useQuery } from '@apollo/react-hooks';
import { LIST_TEMPLATES } from '../../../../queries';
import { Title } from '../elements';
import { MyTemplatesList } from './elements';

export const MyTemplates = () => {
  const { data = {} } = useQuery(LIST_TEMPLATES);

  if (data.me && !data.me.templates.length) {
    return null;
  }

  return (
    <>
      <Title>My Templates</Title>
      <MyTemplatesList>
        {data.me
          ? data.me.templates.map((template, i) => {
              return (
                <CustomTemplate
                  template={template}
                  i={i}
                  onClick={() => history.push(sandboxUrl(template.sandbox))}
                />
              );
            })
          : new Array(3).fill({}).map((_, i) => <CustomTemplate i={i} />)}
      </MyTemplatesList>
    </>
  );
};
